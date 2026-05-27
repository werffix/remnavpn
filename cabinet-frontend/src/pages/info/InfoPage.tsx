import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader } from '@/components/ui';
import { useState } from 'react';
import { BookOpen, Shield, FileText, HelpCircle, ChevronDown } from 'lucide-react';

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'privacy' | 'offer' | 'faq'>('rules');
  const { data: rules } = useQuery({ queryKey: ['rules'], queryFn: api.info.rules, enabled: activeTab === 'rules' });
  const { data: privacy } = useQuery({ queryKey: ['privacy'], queryFn: api.info.privacy, enabled: activeTab === 'privacy' });
  const { data: faq } = useQuery({ queryKey: ['faq'], queryFn: api.info.faq, enabled: activeTab === 'faq' });
  const { data: offer } = useQuery({ queryKey: ['offer'], queryFn: api.info.offer, enabled: activeTab === 'offer' });

  const tabs = [
    { key: 'rules', label: 'Правила', icon: BookOpen },
    { key: 'privacy', label: 'Конфиденциальность', icon: Shield },
    { key: 'offer', label: 'Оферта', icon: FileText },
    { key: 'faq', label: 'FAQ', icon: HelpCircle },
  ] as const;

  return (
    <div>
      <PageHeader title="Информация" />
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`btn-sm whitespace-nowrap ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>
      <div className="card">
        {activeTab === 'faq' ? (
          faq?.length ? (
            <div className="space-y-2">
              {faq.map((item: any, i: number) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-3 px-4 rounded-xl hover:bg-dark-600 transition-colors">
                    <span className="font-medium">{item.question}</span>
                    <ChevronDown size={16} className="text-dark-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-4 pb-3 text-dark-300 text-sm">{item.answer}</p>
                </details>
              ))}
            </div>
          ) : <p className="text-dark-400">FAQ пуст</p>
        ) : (
          <div className="prose prose-invert max-w-none text-dark-200 whitespace-pre-wrap text-sm leading-relaxed">
            {activeTab === 'rules' && (rules?.content || rules?.text || 'Нет данных')}
            {activeTab === 'privacy' && (privacy?.content || privacy?.text || 'Нет данных')}
            {activeTab === 'offer' && (offer?.content || offer?.text || 'Нет данных')}
          </div>
        )}
      </div>
    </div>
  );
}
