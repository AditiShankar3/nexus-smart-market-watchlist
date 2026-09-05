import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Table, 
  X, 
  RefreshCw, 
  Layers, 
  Check, 
  Search, 
  FileText,
  Key,
  Calendar,
  Code
} from 'lucide-react';
import { fetchDbTables, fetchDbTableData } from '../api';

export default function DatabaseExplorerModal({
  isOpen,
  onClose,
  theme = 'light'
}) {
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState('users');
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const isLight = theme === 'light';

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchDbTables()
      .then(res => {
        const tbls = res.tables || [];
        setTables(tbls);
        if (tbls.length > 0 && !activeTable) {
          setActiveTable(tbls[0].name);
        }
      })
      .catch(err => console.error("Failed to load tables", err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !activeTable) return;
    setLoading(true);
    fetchDbTableData(activeTable, 100)
      .then(res => {
        setTableData(res);
      })
      .catch(err => console.error(`Failed to load ${activeTable}`, err))
      .finally(() => setLoading(false));
  }, [isOpen, activeTable]);

  if (!isOpen) return null;

  const filteredRows = (tableData?.rows || []).filter(row => {
    if (!searchQuery) return true;
    return Object.values(row).some(v => 
      String(v).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border transition-all ${
          isLight 
            ? 'bg-[#F8F2EF] border-[#E5D6CE] text-[#1E293B]' 
            : 'bg-[#121826] border-slate-700/90 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'border-[#E5D6CE] bg-[#FFFFFF]' : 'border-slate-800 bg-[#0D121F]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-xs border ${
              isLight ? 'bg-[#E7EBEE] border-[#D2DCE4] text-blue-600' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  SQLite Database Inspector
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isLight ? 'bg-[#D2DCE4] text-slate-800 border-[#DEC3B3]' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  market_watchlist.db (WAL Mode)
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Inspect live persistent tables, user sessions, exit price JSON, and graph edges.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isLight ? 'bg-[#E7EBEE] hover:bg-[#DEC3B3]/40 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Sidebar + Table View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Table Selector Sidebar */}
          <div className={`w-full md:w-64 p-3 border-r overflow-y-auto ${
            isLight ? 'border-[#E5D6CE] bg-[#FFFFFF]/60' : 'border-slate-800 bg-[#0D121F]/60'
          }`}>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block px-3 py-1.5 ${
              isLight ? 'text-slate-500' : 'text-slate-500'
            }`}>
              Tables ({tables.length})
            </span>

            <div className="space-y-1 mt-1">
              {tables.map(tbl => {
                const isActive = activeTable === tbl.name;
                return (
                  <button
                    key={tbl.name}
                    onClick={() => { setActiveTable(tbl.name); setSearchQuery(''); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition border ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isLight
                        ? 'text-slate-700 hover:bg-[#E7EBEE] border-transparent'
                        : 'text-slate-300 hover:bg-slate-800/80 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Table className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      <span className="font-mono">{tbl.name}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-white/20 text-white' : isLight ? 'bg-[#E7EBEE] text-slate-600' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tbl.row_count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Table Data View */}
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            
            {/* Table Action / Search bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search in ${activeTable}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full text-xs rounded-xl pl-8 pr-3 py-1.5 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    isLight 
                      ? 'bg-[#FFFFFF] border-[#DEC3B3] text-slate-900 placeholder-slate-400' 
                      : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                  }`}
                />
              </div>

              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Showing {filteredRows.length} rows
              </span>
            </div>

            {/* Table Grid */}
            <div className={`flex-1 overflow-auto border rounded-2xl ${
              isLight ? 'bg-[#FFFFFF] border-[#E5D6CE]' : 'bg-slate-900/80 border-slate-800'
            }`}>
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-500 font-mono">
                  Loading table data...
                </div>
              ) : filteredRows.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No records match your query or table is empty.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className={`sticky top-0 border-b font-mono text-[11px] uppercase tracking-wider ${
                    isLight ? 'bg-[#E7EBEE] border-[#E5D6CE] text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    <tr>
                      {tableData?.columns?.map(col => (
                        <th key={col} className="p-2.5 font-semibold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-mono text-[11px] ${
                    isLight ? 'divide-[#E5D6CE]/60' : 'divide-slate-800/60'
                  }`}>
                    {filteredRows.map((row, rIdx) => (
                      <tr 
                        key={rIdx} 
                        className={`transition ${
                          isLight ? 'hover:bg-[#F8F2EF]' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        {tableData?.columns?.map(col => {
                          const val = row[col];
                          const isJson = typeof val === 'string' && (val.startsWith('{') || val.startsWith('['));
                          return (
                            <td key={col} className="p-2.5 max-w-[250px] truncate" title={String(val)}>
                              {isJson ? (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] border font-mono ${
                                  isLight ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                }`}>
                                  JSON ({val.length} chars)
                                </span>
                              ) : val === null || val === undefined ? (
                                <span className="text-slate-400 italic">NULL</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs font-mono ${
          isLight ? 'border-[#E5D6CE] bg-[#FFFFFF]' : 'border-slate-800 bg-[#0D121F]'
        }`}>
          <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>
            Path: <code className="text-blue-600 dark:text-blue-400 font-bold">backend/market_watchlist.db</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
