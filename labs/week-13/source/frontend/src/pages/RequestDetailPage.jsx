import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import useManualReload from '../hooks/useManualReload.js';
import { getRequestById } from '../services/requestService.js';
import { apiFetch } from '../services/apiClient.js';
import { useSession } from '../services/authSession.js';

function RequestDetailPage() {
  const session = useSession();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const { requestId } = useParams();
  const [loadState, setLoadState] = useState('loading');
  const [request, setRequest] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, reload] = useManualReload();

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
          <dl><div><dt>ID</dt><dd>{request.id}</dd></div><div><dt>ผู้แจ้ง</dt><dd>{request.requesterName}</dd></div><div><dt>สถานที่</dt><dd>{request.location}</dd></div><div><dt>รายละเอียด</dt><dd>{request.details}</dd></div><div><dt>ความเร่งด่วน</dt><dd>{request.priority}</dd></div><div><dt>สถานะ</dt><dd>{request.status}</dd></div></dl>
          <Link to="/">กลับ Dashboard</Link>
          {session?.user?.role === 'staff' && <form className="status-form" onSubmit={async (event) => {
            event.preventDefault();
            const status = new FormData(event.currentTarget).get('status');
            setSaving(true); setNotice('');
            try {
              await apiFetch(`/api/requests/${encodeURIComponent(requestId)}`, { method: 'PUT', body: JSON.stringify({ status }) });
              setRequest((previous) => ({ ...previous, status }));
              setNotice('บันทึกสถานะเรียบร้อยแล้ว');
            } catch (err) { setNotice(err.message); }
            finally { setSaving(false); }
          }}>
            <label>สถานะคำร้อง<select name="status" defaultValue={request.status} disabled={saving}>
              <option value="pending">รอดำเนินการ</option><option value="in-progress">กำลังดำเนินการ</option><option value="completed">เสร็จสิ้น</option>
            </select></label><button className="button primary" disabled={saving}>บันทึกสถานะ</button>
          </form>}
          {notice && <p role="status">{notice}</p>}
        </article>
      )}
    </section>
  );
}

export default RequestDetailPage;
