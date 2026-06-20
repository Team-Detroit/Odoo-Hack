import React, { useState, useEffect } from 'react';
import { Toggle } from '../../components/common/Toggle';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { tableService } from '../../services/tableService';
import { selfOrderingService } from '../../services/selfOrderingService';
import { Table } from '../../types/table';

export const SelfOrderingSettings: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<'online' | 'qr_menu'>('online');
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedTableId, setCopiedTableId] = useState<string | null>(null);

  // Fetch initial config from backend
  useEffect(() => {
    selfOrderingService.getConfig()
      .then(config => {
        setEnabled(!!config.isEnabled);
        // Map mode if it comes from backend
        const mappedMode = config.mode === 'qr-only' ? 'qr_menu' : (config.mode || 'online');
        setMode(mappedMode as 'online' | 'qr_menu');
      })
      .catch(err => console.error('Failed to load self ordering config', err));
  }, []);

  // Fetch tables dynamically
  useEffect(() => {
    if (enabled) {
      setIsLoadingTables(true);
      tableService.getAll()
        .then(res => setTables(res || []))
        .catch(err => console.error('Failed to load tables', err))
        .finally(() => setIsLoadingTables(false));
    }
  }, [enabled]);

  const save = () => {
    // Convert 'qr_menu' UI value to backend 'qr-only' mode if needed
    const backendMode = mode === 'qr_menu' ? 'qr-only' : 'online';
    selfOrderingService.updateConfig({ isEnabled: enabled, mode: backendMode })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch(err => console.error('Failed to save settings', err));
  };

  const getQRUrl = (tableNum: number | string) => {
    const targetUrl = `https://52wr2pbq-5173.inc1.devtunnels.ms/customer-display?table=T${tableNum}`;
    return {
      targetUrl,
      qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl)}`
    };
  };

  const copyLink = (targetUrl: string, tableId: string) => {
    navigator.clipboard.writeText(targetUrl)
      .then(() => {
        setCopiedTableId(tableId);
        setTimeout(() => setCopiedTableId(null), 2000);
      })
      .catch(err => console.error('Failed to copy', err));
  };

  const downloadQR = async (qrImageUrl: string, tableName: string) => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${tableName}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download QR code image', err);
      // Fallback: open in new tab
      window.open(qrImageUrl, '_blank');
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Self Ordering Settings</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Enable Self Ordering</p>
            <p className="text-xs text-gray-400 mt-0.5">Allow customers to order via QR code</p>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>

        {!enabled && (
          <div className="border-t border-gray-100 pt-4 text-center py-6">
            <p className="text-sm text-gray-500 font-medium">
              Enable self ordering to generate table QR codes.
            </p>
          </div>
        )}

        {enabled && (
          <>
            <div className="border-t border-gray-100 pt-4">
              <Select
                label="Mode"
                value={mode}
                onChange={e => setMode(e.target.value as 'online' | 'qr_menu')}
                options={[
                  { label: 'Online Ordering (browse + cart + place order)', value: 'online' },
                  { label: 'QR Menu Only (browse only, no cart)', value: 'qr_menu' },
                ]}
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Table QR Codes</label>
              <p className="text-xs text-gray-400 mb-4">Each synchronized table gets a unique customer portal link.</p>
              
              {isLoadingTables ? (
                <div className="text-center py-8 text-xs text-gray-400">Loading tables...</div>
              ) : tables.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">No tables found. Add tables in Floor setup first.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {tables.map(table => {
                    const tableNum = table.tableNumber ?? table.number;
                    const tableName = `Table T${tableNum}`;
                    const { targetUrl, qrImageUrl } = getQRUrl(tableNum);
                    
                    return (
                      <div key={table.id} className="border border-gray-200 rounded-2xl p-4 text-center bg-gray-50/50 flex flex-col justify-between items-center shadow-xs">
                        <div className="w-32 h-32 bg-white rounded-xl border border-gray-150 p-2 flex items-center justify-center shadow-xs mb-3">
                          <img src={qrImageUrl} alt={tableName} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs font-bold text-gray-800 mb-3">{tableName}</p>
                        <div className="w-full space-y-1.5 mt-auto">
                          <button
                            onClick={() => copyLink(targetUrl, table.id)}
                            className="w-full py-1 bg-white hover:bg-gray-100 border border-gray-250 rounded-lg text-[10px] font-bold text-gray-700 cursor-pointer shadow-xs transition-colors"
                          >
                            {copiedTableId === table.id ? '✓ Copied!' : 'Copy Link'}
                          </button>
                          <button
                            onClick={() => downloadQR(qrImageUrl, tableName)}
                            className="w-full py-1 bg-teal-600 hover:bg-teal-700 rounded-lg text-[10px] font-bold text-white cursor-pointer shadow-xs transition-colors"
                          >
                            Download QR
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Button onClick={save} isLoading={false}>{saved ? '✓ Saved!' : 'Save Settings'}</Button>
    </div>
  );
};
