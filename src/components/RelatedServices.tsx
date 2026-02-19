import { ExternalLink } from 'lucide-react';

const RelatedServices = () => {
  const services = [
    {
      title: 'Wi-Fi QR 印刷所',
      description: 'Wi-Fiに自動接続できるQRコードを無料簡単作成で印刷データ（PDF）に',
      url: 'https://www.wifi-qr.online/',
    },
    {
      title: 'シンプルメニュー表印刷',
      description: '飲食店で使えるシンプルなメニュー表をオンライン簡単作成して印刷データ（PDF）に',
      url: 'https://menu-pdf.online/',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">関連サービス</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <a
              key={index}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-400 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <ExternalLink className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" size={20} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedServices;
