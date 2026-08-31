import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import RequestCard from '../components/RequestCard.jsx';
import RequestList from '../components/RequestList.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { deleteRequest, getRequests, resetRequests, updateRequestStatus } from '../services/requestService.js';

function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [loadState, setLoadState] = useState('loading');
  const [notice, setNotice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const statusFilter = searchParams.get('status') || 'all';

  function setStatusFilter(newStatus) {
    if (newStatus === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', newStatus);
    }
    setSearchParams(searchParams);
  }

  const { reloadKey, triggerReload } = useManualReload();

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      setLoadState('loading');
      try {
        const data = await getRequests();
        if (!ignore) {
          setRequests(data);
          setLoadState('success');
        }
      } catch (err) {
        if (!ignore) {
          setLoadState('error');
        }
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const summary = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((request) => request.status === 'pending').length,
    inProgress: requests.filter((request) => request.status === 'in-progress').length,
    completed: requests.filter((request) => request.status === 'completed').length,
  }), [requests]);

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query || 
      request.id.toLowerCase().includes(query) || 
      request.requesterName.toLowerCase().includes(query) || 
      request.details.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  async function handleDelete(id) {
    try {
      const nextRequests = await deleteRequest(id);
      setRequests(nextRequests);
      setNotice(`ลบคำร้อง ${id} สำเร็จ`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'ลบไม่สำเร็จ');
    }
  }

  async function handleReset() {
    try {
      const nextRequests = await resetRequests();
      setRequests(nextRequests);
      setNotice('รีเซ็ตข้อมูลเดโมเรียบร้อย');
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'รีเซ็ตไม่สำเร็จ');
    }
  }

  async function handleMarkDone(requestId) {
    try {
      const nextRequests = await updateRequestStatus(requestId, 'completed');
      setRequests(nextRequests);
      setNotice(`อัปเดตคำร้อง ${requestId} เป็นเสร็จสิ้นแล้ว`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'อัปเดตสถานะไม่สำเร็จ');
    }
  }

  if (loadState === 'loading') return <LoadingState />;
  if (loadState === 'error') return <ErrorState onRetry={triggerReload} />;

  return (
    <div className="container">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="badge">Routed + Persistent</span>
          <h1>Dashboard</h1>
          <p className="subtle">ติดตามคำร้องจาก URL, Service Layer และ browser storage</p>
        </div>
        <div>
          <button type="button" className="button secondary" onClick={handleReset}>
            Reset Demo Data
          </button>
        </div>
      </header>

      {notice && <div className="notice" role="status">{notice}</div>}

      <SummaryPanel summary={summary} />

      <section className="panel" aria-labelledby="request-list-title">
        <div className="section-heading">
          <h2 id="request-list-title">รายการคำร้อง</h2>
          <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
        </div>

        <input 
          type="search" 
          placeholder="ค้นหาจากผู้แจ้งหรือรายละเอียด" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }} 
        />

        <RequestList 
          requests={filteredRequests} 
          onDeleteRequest={handleDelete} 
          onMarkDone={handleMarkDone} 
        />
      </section>
    </div>
  );
}

export default DashboardPage;