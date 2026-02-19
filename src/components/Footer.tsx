interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onContactClick: () => void;
}

export default function Footer({ onPrivacyClick, onTermsClick, onContactClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">宛名ラベルメーカー</h3>
            <p className="text-sm text-gray-300">
              エーワン対応の無料宛名ラベル・住所シール作成ツール。
              個人情報はすべてブラウザ内で処理され、安全にご利用いただけます。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">リンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onPrivacyClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  プライバシーポリシー
                </button>
              </li>
              <li>
                <button
                  onClick={onTermsClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  利用規約
                </button>
              </li>
              <li>
                <button
                  onClick={onContactClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  お問い合わせ
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">注意事項</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 印刷前に必ずプレビューをご確認ください</li>
              <li>• 用紙の型番が正しいか確認してください</li>
              <li>• 位置がずれる場合は微調整機能をお使いください</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} 宛名ラベルメーカー. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
