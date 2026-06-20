import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kdsService } from '../../services/kdsService';
import { KdsTicket, KdsStage } from '../../types/kds';
import { KDS_STAGES, KDS_STAGE_LABELS, getNextKdsStage } from '../../constants/kdsStages';
import { Spinner } from '../../components/common/Spinner';
import { Smartphone, Monitor, Check } from 'lucide-react';

const stageColors: Record<string, string> = {
  to_cook: 'border-red-300 bg-red-50',
  preparing: 'border-yellow-300 bg-yellow-50',
  completed: 'border-green-300 bg-green-50',
};

const stageBadge: Record<string, string> = {
  to_cook: 'bg-red-100 text-red-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
};

const TicketCard: React.FC<{ ticket: KdsTicket; onAdvance: (id: string) => void }> = ({ ticket, onAdvance }) => {
  const [doneItems, setDoneItems] = useState<Set<string>>(new Set());
  const toggleItem = (id: string) => setDoneItems(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const next = getNextKdsStage(ticket.stage);
  const canAdvance = ticket.stage !== KDS_STAGES.COMPLETED;

  return (
    <div className={`border-2 rounded-xl overflow-hidden ${stageColors[ticket.stage]}`}>
      <div className="px-3 py-2.5 bg-white/70 flex items-center justify-between">
        <div>
          <span className="font-mono font-bold text-gray-800 text-sm">#{ticket.ticketNumber}</span>
          {ticket.tableNumber && <span className="ml-2 text-xs text-gray-500">T{ticket.tableNumber}</span>}
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${stageBadge[ticket.stage]}`}>{KDS_STAGE_LABELS[ticket.stage]}</span>
      </div>
      {(ticket.selfOrder || ticket.paymentTag) && (
        <div className="px-3 py-1 bg-white/40 flex flex-wrap gap-1.5 border-b border-gray-100">
          {ticket.selfOrder && (
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Smartphone className="w-2.5 h-2.5" /> Self-Ordering
            </span>
          )}
          {ticket.paymentTag && (
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
              ticket.paymentTag.toLowerCase().includes('paid') 
                ? 'bg-emerald-100 text-emerald-850' 
                : 'bg-amber-100 text-amber-850'
            }`}>
              {ticket.paymentTag}
            </span>
          )}
        </div>
      )}
      <div className="px-3 py-2 space-y-1">
        {ticket.items.map(item => (
          <div key={item.id} onClick={() => toggleItem(item.id)}
            className={`flex items-center gap-2 py-1 cursor-pointer rounded px-1 hover:bg-white/50 transition-colors ${doneItems.has(item.id) ? 'opacity-40' : ''}`}>
            <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${doneItems.has(item.id) ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400'}`}>{doneItems.has(item.id) ? <Check className="w-3 h-3 stroke-[3]" /> : ''}</span>
            <span className={`flex-1 text-sm ${doneItems.has(item.id) ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.productName}</span>
            <span className="text-xs font-bold text-gray-600">×{item.quantity}</span>
          </div>
        ))}
      </div>
      {canAdvance && (
        <div className="px-3 pb-3">
          <button onClick={() => onAdvance(ticket.id)}
            className="w-full py-1.5 bg-gray-800 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors">
            → {KDS_STAGE_LABELS[next as KdsStage]}
          </button>
        </div>
      )}
      <div className="px-3 pb-2 text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );
};

const StageColumn: React.FC<{ stage: KdsStage; tickets: KdsTicket[]; onAdvance: (id: string) => void }> = ({ stage, tickets, onAdvance }) => (
  <div className="flex-1 min-w-64">
    <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg ${stageBadge[stage]}`}>
      <span className="font-semibold text-sm">{KDS_STAGE_LABELS[stage]}</span>
      <span className="ml-auto bg-white/70 px-2 py-0.5 rounded-full text-xs font-bold">{tickets.length}</span>
    </div>
    <div className="space-y-3">
      {tickets.map(t => <TicketCard key={t.id} ticket={t} onAdvance={onAdvance} />)}
      {tickets.length === 0 && <div className="text-center py-8 text-gray-300 text-sm">No tickets</div>}
    </div>
  </div>
);

export const KdsBoard: React.FC = () => {
  const qc = useQueryClient();
  const { data: tickets = [], isLoading } = useQuery({ queryKey: ['kds'], queryFn: kdsService.mockGetAll });
  const [search, setSearch] = useState('');

  const advance = useMutation({
    mutationFn: (id: string) => {
      const ticket = tickets.find(t => t.id === id)!;
      const next = getNextKdsStage(ticket.stage) as KdsStage;
      return kdsService.updateStage(id, next);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kds'] }),
  });

  const filtered = tickets.filter(t =>
    !search || t.ticketNumber.includes(search) || t.items.some(i => i.productName.toLowerCase().includes(search.toLowerCase()))
  );

  const byStage = (stage: KdsStage) => filtered.filter(t => t.stage === stage);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-gray-700" />
          <h1 className="font-bold text-gray-800">Kitchen Display</h1>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticket or product…"
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <span className="ml-auto text-xs text-gray-400">{new Date().toLocaleTimeString('en-IN')}</span>
      </div>
      <div className="flex gap-4 p-4 overflow-x-auto flex-1">
        {([KDS_STAGES.TO_COOK, KDS_STAGES.PREPARING, KDS_STAGES.COMPLETED] as KdsStage[]).map(stage => (
          <StageColumn key={stage} stage={stage} tickets={byStage(stage)} onAdvance={(id) => advance.mutate(id)} />
        ))}
      </div>
    </div>
  );
};
