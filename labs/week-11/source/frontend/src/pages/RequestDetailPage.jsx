import { useEffect, useRef, useState } from 'react';
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
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const revision = useRef(0);

  useEffect(() => {
    let ignore = false;
    revision.current += 1;
    setSaving(false);
    setSaveError('');
    setSaveMessage('');
    setLoadState('loading');
    getRequestById(requestId).then((result) => {
      if (ignore) return;
      setRequest(result);
      setSelectedStatus(result?.status ?? 'pending');
      setLoadState('success');
    }).catch((error) => {
      if (ignore) return;
      setErrorMessage(error instanceof Error ? error.message : 'โหลดรายละเอียดไม่สำเร็จ');
      setLoadState('error');
    });
    return () => { ignore = true; revision.current += 1; };
  }, [requestId, reloadKey]);

  async function saveStatus(event) {
    event.preventDefault();
    if (!request || saving || selectedStatus === request.status) return;
    const currentRevision = revision.current;
    setSaving(true);
    setSaveError('');
    setSaveMessage('');
    try {
      const updated = await updateRequestStatus(request.id, selectedStatus);
      if (currentRevision !== revision.current) return;
      setRequest(updated);
      setSelectedStatus(updated.status);
      setSaveMessage('บันทึกสถานะเรียบร้อยแล้ว');
    } catch (error) {
      if (currentRevision !== revision.current) return;
      setSaveError(error instanceof Error ? error.message : 'บันทึกสถานะไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      if (currentRevision === revision.current) setSaving(false);
    }
  }

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
          <form onSubmit={saveStatus} className="status-edit" aria-busy={saving}>
            <div className="field">
              <label htmlFor="request-status">เปลี่ยนสถานะคำร้อง</label>
              <select id="request-status" value={selectedStatus} disabled={saving} onChange={(event) => { setSelectedStatus(event.target.value); setSaveError(''); setSaveMessage(''); }}>
                <option value="pending">รอดำเนินการ</option>
                <option value="in-progress">กำลังดำเนินการ</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>
            <button className="button primary" type="submit" disabled={saving || selectedStatus === request.status}>{saving ? 'กำลังบันทึก…' : 'บันทึกสถานะ'}</button>
            {saveError && <p className="error" role="alert">{saveError}</p>}
            <p role="status" className="status">{saveMessage}</p>
          </form>
          <Link to="/">กลับ Dashboard</Link>
        </article>
      )}
    </section>
  );
}

export default RequestDetailPage;
