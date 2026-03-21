export default function SolutionConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-icon">🔓</div>
        <h3 className="modal-title">Reveal Full Solution?</h3>
        <p className="modal-body">
          Viewing the solution now will mark this question as incomplete.
          Are you sure you want to see it?
        </p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--cancel" onClick={onCancel}>
            Keep Trying
          </button>
          <button className="modal-btn modal-btn--confirm" onClick={onConfirm}>
            Yes, Show Solution
          </button>
        </div>
      </div>
    </div>
  );
}
