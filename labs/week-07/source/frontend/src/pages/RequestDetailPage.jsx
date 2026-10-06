import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { getRequestById, updateRequestStatus } from '../services/requestService.js';

function RequestDetailPage() {
  const { requestId } = useParams();
  const [loadState, setLoadState] = useState('loading');
  const [request, setRequest] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, reload] = useManualReload();
  const [updating, setUpdating] = useState(false);

  async function handleChangeStatus(nextStatus) {
    setUpdating(true);
    try {
      const updated = await updateRequestStatus(request.id, nextStatus);
      setRequest(updated); // อัปเดตข้อมูลบนหน้าจอเมื่อสำเร็จ
    } catch (error) {
      setErrorMessage(error.message); // แสดง error ถ้าไม่สำเร็จ
    } finally {
      setUpdating(false); // ปลดล็อกปุ่ม
    }
  }

  useEffect(() => {
    let ignore = false;
    setLoadState('loading');
    getRequestById(requestId).then((result) => {
      if (ignore) return;
      setRequest(result);
      setLoadState('success');
    }).catch((error) => {
      if (ignore) return;
      setErrorMessage(error instanceof Error ? error.message : 'โหลดรายละเอียดไม่สำเร็จ');
      setLoadState('error');
    });
    return () => { ignore = true; };
  }, [requestId, reloadKey]);

  return (
    <section data-testid="page-request-detail">
      <div className="page-heading"><div><p className="eyebrow dark">DYNAMIC ROUTE</p><h1>รายละเอียดคำร้อง</h1><p>Request ID: <code>{requestId}</code></p></div></div>
      {loadState === 'loading' && <LoadingState message="กำลังโหลดรายละเอียด…" />}
      {loadState === 'error' && <ErrorState message={errorMessage} onRetry={reload} />}
      {loadState === 'success' && !request && (
        <section className="state-card"><h2>ไม่พบคำร้อง</h2><p>ไม่พบข้อมูลสำหรับ ID <code>{requestId}</code></p><Link to="/">กลับ Dashboard</Link></section>
      )}
      {loadState === 'success' && request && (
        <article className="panel detail-card">
          <h2>{request.requestType}</h2>
          <dl>
            <div><dt>ID</dt><dd>{request.id}</dd></div>
            <div><dt>ผู้แจ้ง</dt><dd>{request.requesterName}</dd></div>
            <div><dt>สถานที่</dt><dd>{request.location}</dd></div>
            <div><dt>รายละเอียด</dt><dd>{request.details}</dd></div>
            <div><dt>ความเร่งด่วน</dt><dd>{request.priority}</dd></div>
            <div><dt>สถานะ</dt><dd>{request.status}</dd></div>
          </dl>
          <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
            {/* ปุ่ม Pending */}
            <button 
              className="button"
              style={{
                background: request.status === 'pending' ? '#e2e8f0' : '#fff0cc',
                color: request.status === 'pending' ? '#94a3b8' : '#7a4700',
                border: '1px solid #f6d28b',
                cursor: updating || request.status === 'pending' ? 'not-allowed' : 'pointer',
              }}
              disabled={updating || request.status === 'pending'} 
              onClick={() => handleChangeStatus('pending')}
            >
              Pending
            </button>
            {/* ปุ่ม In Progress */}
            <button 
              className="button"
              style={{
                background: request.status === 'in-progress' ? '#e2e8f0' : '#dff6f5',
                color: request.status === 'in-progress' ? '#94a3b8' : '#075e68',
                border: '1px solid #a2e8e5',
                cursor: updating || request.status === 'in-progress' ? 'not-allowed' : 'pointer',
              }}
              disabled={updating || request.status === 'in-progress'} 
              onClick={() => handleChangeStatus('in-progress')}
            >
              In Progress
            </button>
            {/* ปุ่ม Completed */}
            <button 
              className="button"
              style={{
                background: request.status === 'completed' ? '#e2e8f0' : '#dff4e8',
                color: request.status === 'completed' ? '#94a3b8' : '#176b45',
                border: '1px solid #a3e3be',
                cursor: updating || request.status === 'completed' ? 'not-allowed' : 'pointer',
              }}
              disabled={updating || request.status === 'completed'} 
              onClick={() => handleChangeStatus('completed')}
            >
              Completed
            </button>
          </div>
          {/* ปุ่มกลับ Dashboard สีน้ำเงินสวยงาม */}
          <Link className="button primary inline" to="/">กลับ Dashboard</Link>
        </article>
      )}
    </section>
  );
}

export default RequestDetailPage;
