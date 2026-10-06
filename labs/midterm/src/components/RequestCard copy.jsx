import { Link } from 'react-router-dom';
import PriorityBadge from './PriorityBadge.jsx';

function RequestCard({ request, onDeleteRequest, onMarkDone }) {
  return (
    <article className="request-card" data-testid={`request-${request.id}`}>
      <div>
        <span className="request-id">{request.id}</span>
        <h3>{request.requestType}</h3>
        <p>{request.location}</p>
        <p>{request.details}</p>
        <div>
          <span className={`badge ${request.status}`}>{request.status}</span>
          <span className="priority"> · </span>
          <PriorityBadge priority={request.priority} />
        </div>
      </div>

      <div className="card-actions" style={{ display: 'flex', gap: '8px' }}>
        {request.status !== 'completed' && onMarkDone && (
          <button
            type="button"
            className="button secondary small"
            onClick={() => onMarkDone(request.id)}
          >
            ทำเสร็จ
          </button>
        )}

        <button
          type="button"
          className="button danger small"
          onClick={() => onDeleteRequest(request.id)}
        >
          ลบ
        </button>
      </div>
    </article>
  );
}

export default RequestCard;