import { useBooking } from '../context/BookingContext';

export default function Toast() {
  const { toast } = useBooking();
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type === 'info' ? 'info' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="material-symbols-outlined" style={{
            fontSize: 18,
            color: toast.type === 'info' ? 'var(--outline)' : 'var(--gold)',
          }}>
            {toast.type === 'info' ? 'info' : 'check_circle'}
          </span>
          {toast.message}
        </div>
      </div>
    </div>
  );
}
