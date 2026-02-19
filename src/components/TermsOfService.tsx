import { X } from 'lucide-react';

interface TermsOfServiceProps {
  onClose: () => void;
}

export default function TermsOfService({ onClose }: TermsOfServiceProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800">利用規約</h2>
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
              本利用規約（以下「本規約」）は、宛名シール印刷所（以下「当サイト」）が提供するサービスの利用条件を定めるものです。
              ユーザーは、当サイトを利用することにより、本規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第1条（適用）</h3>
            <p className="text-gray-700 leading-relaxed">
              本規約は、ユーザーと当サイトとの間の当サイトの利用に関わる一切の関係に適用されるものとします。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第2条（サービスの内容）</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              当サイトは、エーワン（A-one）などのA4サイズラベル用紙に対応した宛名ラベル印刷用のPDFを作成するツールを無料で提供します。
            </p>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、ユーザーが入力した住所、氏名などの個人情報をサーバーに保存せず、すべてブラウザ内で処理します。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第3条（禁止事項）</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>当サイトが許諾しない方法で当サイトのサービスを商業目的で利用する行為</li>
              <li>当サイト、他のユーザー、または第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為</li>
              <li>その他、当サイトが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第4条（免責事項）</h3>
            <div className="space-y-3 text-gray-700">
              <p className="leading-relaxed">
                当サイトは、当サイトのサービスに関して、その正確性、完全性、有用性、安全性、適法性などについて、いかなる保証も行いません。
              </p>
              <p className="leading-relaxed">
                当サイトは、ユーザーが当サイトを利用したことにより発生した損害について、一切の責任を負いません。
                ただし、当サイトに故意または重大な過失がある場合を除きます。
              </p>
              <p className="leading-relaxed">
                ユーザーは、作成したPDFファイルの印刷結果について、事前にプレビューで確認し、自己の責任において利用するものとします。
                印刷のずれや誤りについて、当サイトは一切の責任を負いません。
              </p>
              <p className="leading-relaxed">
                当サイトは、予告なくサービスの内容を変更、または提供を中止することがあります。
                これによりユーザーに生じた損害について、当サイトは一切の責任を負いません。
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第5条（著作権）</h3>
            <p className="text-gray-700 leading-relaxed">
              当サイトのコンテンツ（テキスト、画像、プログラムなど）の著作権は、当サイトまたは正当な権利を有する第三者に帰属します。
              ユーザーは、当サイトの事前の許諾なく、これらを複製、転載、改変、販売などすることはできません。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第6条（利用規約の変更）</h3>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
              変更後の利用規約は、当サイトに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第7条（個人情報の取扱い）</h3>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、当サイトの利用によって取得する個人情報については、
              当サイトの「プライバシーポリシー」に従い適切に取り扱うものとします。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第8条（準拠法・裁判管轄）</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              本規約の解釈にあたっては、日本法を準拠法とします。
            </p>
            <p className="text-gray-700 leading-relaxed">
              当サイトに関して紛争が生じた場合には、当サイトの所在地を管轄する裁判所を専属的合意管轄とします。
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">第9条（お問い合わせ）</h3>
            <p className="text-gray-700 leading-relaxed">
              本規約に関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。
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
