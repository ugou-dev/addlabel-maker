import { useState } from 'react';
import { FileSpreadsheet, PenTool, Printer } from 'lucide-react';
import { AddressData, InputMode, LabelTemplate, SenderData } from './types';
import { LABEL_TEMPLATES } from './lib/labelTemplates';
import CsvUpload from './components/CsvUpload';
import ManualInput from './components/ManualInput';
import PrintSettings from './components/PrintSettings';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactForm from './components/ContactForm';
import RelatedServices from './components/RelatedServices';
import AdSense from './components/AdSense';
import { generatePDF } from './lib/pdfGenerator';

type Step = 'select-mode' | 'input' | 'settings';
type ModalType = 'privacy' | 'terms' | 'contact' | null;

function App() {
  const [step, setStep] = useState<Step>('select-mode');
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<LabelTemplate>(LABEL_TEMPLATES[0]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleModeSelect = (mode: InputMode) => {
    setInputMode(mode);
    setStep('input');
  };

  const handleDataLoaded = (data: AddressData[]) => {
    setAddresses(data);
    setStep('settings');
  };

  const handleGeneratePdf = async (
    template: LabelTemplate,
    startPosition: number,
    offsetX: number,
    offsetY: number,
    includeSender: boolean,
    senderData: SenderData | null,
    fontFamily: 'mincho' | 'gothic'
  ) => {
    await generatePDF(
      addresses,
      template,
      startPosition,
      offsetX,
      offsetY,
      includeSender,
      senderData,
      fontFamily
    );
  };

  const handleBack = () => {
    if (step === 'settings') {
      setStep('input');
    } else if (step === 'input') {
      setStep('select-mode');
      setAddresses([]);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
              <Printer className="text-blue-600 mx-auto mb-3" size={40} />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                宛名ラベルメーカー<br />（CSV・Excel一括取り込み対応）
              </h1>
              <p className="text-gray-600">面倒な設定不要。CSVを投げれば、ズレのないPDFが即座に手に入る。</p>
              <p className="text-xs text-gray-500 mt-2">
                アップロードされた個人情報はサーバーに保存されません。すべてブラウザ内で処理されます。
              </p>
            </header>

            <div className="max-w-4xl mx-auto mb-8">
              <AdSense
                adSlot="1234567890"
                adFormat="horizontal"
                className="my-6"
              />
            </div>

            <div className="max-w-4xl mx-auto">
              {step === 'select-mode' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">用紙を選択</h2>
                <select
                  value={selectedTemplate.code}
                  onChange={(e) => {
                    const template = LABEL_TEMPLATES.find(t => t.code === e.target.value);
                    if (template) setSelectedTemplate(template);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                >
                  {LABEL_TEMPLATES.map((template) => (
                    <option key={template.code} value={template.code}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <button
                  onClick={() => handleModeSelect('manual')}
                  className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-blue-500"
                >
                  <PenTool className="mx-auto mb-4 text-blue-600" size={48} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">手入力モード</h3>
                  <p className="text-sm text-gray-600">
                    画面上のフォームに宛先を入力します
                  </p>
                  <p className="text-xs text-gray-500 mt-2">最大20件まで</p>
                </button>

                <button
                  onClick={() => handleModeSelect('csv')}
                  className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-green-500"
                >
                  <FileSpreadsheet className="mx-auto mb-4 text-green-600" size={48} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">CSV一括取込</h3>
                  <p className="text-sm text-gray-600">
                    CSVファイルから一括で取り込みます
                  </p>
                  <p className="text-xs text-gray-500 mt-2">大量の宛先に最適</p>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">宛名ラベル・住所シールの作り方</h2>
                  <p className="text-gray-700 leading-relaxed">
                    このツールは、エーワン（A-one）などのA4サイズラベル用紙に対応した宛名ラベル印刷ツールです。
                    年賀状や封筒の宛名書き、住所録の管理、発送作業の効率化など、様々な用途でご利用いただけます。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">使い方（3ステップで完了）</h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <div>
                        <span className="font-semibold">用紙を選択</span>
                        <p className="text-sm text-gray-600 mt-1">
                          お使いのラベル用紙の型番を選択してください。エーワンの24面、65面などの主要な用紙に対応しています。
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <div>
                        <span className="font-semibold">入力方法を選択</span>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>手入力モード：</strong>少量の宛先を画面上のフォームで入力できます。会社名や役職の改行位置も自由に設定可能です。
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>CSV一括取込：</strong>ExcelやGoogleスプレッドシートで作成した住所録をCSVファイルで取り込めます。
                          列のマッピングやデフォルト値の設定、改行位置の指定もできます。
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <div>
                        <span className="font-semibold">印刷設定とPDF出力</span>
                        <p className="text-sm text-gray-600 mt-1">
                          プレビューで仕上がりを確認し、必要に応じて印刷開始位置や位置調整を行います。
                          差出人情報の追加や、明朝体・ゴシック体のフォント選択も可能です。PDFをダウンロードして印刷してください。
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    このツールの特徴
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 完全無料で使えます（会員登録不要）</li>
                    <li>• 個人情報はすべてブラウザ内で処理され、サーバーに送信されません</li>
                    <li>• ラベル位置のズレを防ぐ微調整機能付き</li>
                    <li>• 会社名・役職の改行位置を自由にカスタマイズ可能</li>
                    <li>• WindowsでもMacでも、印刷用PDFをすぐに作成できます</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">対応用紙</h4>
                  <p className="text-sm text-gray-600">
                    エーワン（A-one）の主要なラベル用紙に対応しています。
                    お使いの用紙型番を上の選択肢から選んでください。対応用紙は随時追加予定です。
                  </p>
                </div>
              </div>
            </>
          )}

          {step === 'input' && inputMode === 'manual' && (
            <ManualInput onDataLoaded={handleDataLoaded} onBack={() => setStep('select-mode')} />
          )}

          {step === 'input' && inputMode === 'csv' && (
            <CsvUpload onDataLoaded={handleDataLoaded} onBack={() => setStep('select-mode')} />
          )}

              {step === 'settings' && (
                <PrintSettings
                  addresses={addresses}
                  onGeneratePdf={handleGeneratePdf}
                  onBack={handleBack}
                />
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mb-8">
          <AdSense
            adSlot="0987654321"
            adFormat="horizontal"
            className="my-6"
          />
        </div>

        <RelatedServices />

        <div className="max-w-4xl mx-auto px-4 mb-8">
          <AdSense
            adSlot="3333333333"
            adFormat="horizontal"
            className="my-6"
          />
        </div>

        <Footer
          onPrivacyClick={() => setActiveModal('privacy')}
          onTermsClick={() => setActiveModal('terms')}
          onContactClick={() => setActiveModal('contact')}
        />
      </div>

      {activeModal === 'privacy' && (
        <PrivacyPolicy onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'terms' && (
        <TermsOfService onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'contact' && (
        <ContactForm onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}

export default App;
