import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800">プライバシーポリシー</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <section>
            <p className="text-sm text-gray-600 mb-4">最終更新日: 2026年2月13日</p>
            <p className="text-gray-700 leading-relaxed">
              宛名シール印刷所（以下「当サイト」）は、ユーザーの個人情報保護を重要視し、以下のプライバシーポリシーに基づいて適切に取り扱います。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">1. 収集する情報</h3>
            <div className="space-y-3 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">1.1 個人情報の取り扱い</h4>
                <p className="leading-relaxed">
                  当サイトでは、宛名ラベル作成機能において、ユーザーが入力した住所、氏名、会社名などの個人情報は、すべてユーザーのブラウザ内でのみ処理されます。
                  これらの情報は当サイトのサーバーに送信・保存されることはありません。
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">1.2 お問い合わせ情報</h4>
                <p className="leading-relaxed">
                  お問い合わせフォームから送信された情報（氏名、メールアドレス、お問い合わせ内容）は、お問い合わせへの対応目的でのみ使用し、適切に管理いたします。
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">1.3 アクセス解析</h4>
                <p className="leading-relaxed">
                  当サイトでは、Google Analyticsを使用してアクセス解析を行っています。
                  これにより、IPアドレス、ブラウザの種類、訪問ページ、滞在時間などの情報が収集されますが、個人を特定できる情報は含まれません。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Cookieの使用</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              当サイトでは、以下の目的でCookieを使用しています：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>サイトの利便性向上のため</li>
              <li>アクセス解析のため（Google Analytics）</li>
              <li>広告配信のため（Google AdSense）</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              ブラウザの設定により、Cookieを無効にすることができますが、一部機能が利用できなくなる場合があります。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3. 広告配信について</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              当サイトでは、Google AdSenseを使用して広告を配信しています。
              Google AdSenseは、Cookieを使用してユーザーの興味に基づいた広告を表示します。
            </p>
            <p className="text-gray-700 leading-relaxed">
              広告配信に関する詳細やオプトアウト方法については、
              <a
                href="https://policies.google.com/technologies/ads?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Googleの広告ポリシー
              </a>
              をご確認ください。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4. 個人情報の第三者提供</h3>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5. セキュリティ</h3>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、個人情報の保護に最大限の注意を払い、不正アクセス、紛失、破壊、改ざん、漏洩などを防止するため、適切な安全管理措置を講じています。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6. プライバシーポリシーの変更</h3>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。
              変更後のプライバシーポリシーは、当サイトに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">7. お問い合わせ</h3>
            <p className="text-gray-700 leading-relaxed">
              本プライバシーポリシーに関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。
            </p>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
