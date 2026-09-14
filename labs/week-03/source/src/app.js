const form = document.querySelector('#profile-form');
const status = document.querySelector('#form-status');
const goalCount = document.querySelector('#goal-count');

const preview = {
  displayName: document.querySelector('#preview-name'),
  learningRole: document.querySelector('#preview-role'),
  learningGoal: document.querySelector('#preview-goal'),
};

// TODO 5: คืนค่า Object จาก FormData
function readForm() {
return Object.fromEntries(new FormData(form).entries());
}

// TODO 6: อัปเดต preview ทั้ง 3 ค่าโดยใช้ textContent
function renderPreview(data) {
    preview.displayName.textContent = data.displayName.trim() || 'ยังไม่ระบุชื่อ';
    preview.learningRole.textContent = data.learningRole || 'ยังไม่เลือกบทบาท';
    preview.learningGoal.textContent = data.learningGoal.trim() || 'ยังไม่มีเป้าหมายการเรียนรู้';
    goalCount.textContent = `${data.learningGoal.length} ตัวอักษร`;
}

// TODO 7: ตรวจชื่อ >= 2, role ต้องเลือก, goal >= 10
function validate(data) {
  const errors = {};

  if (data.displayName.trim().length < 2) {
    errors.displayName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
  }
  if (!data.learningRole) {
    errors.learningRole = 'กรุณาเลือกบทบาทที่สนใจ';
  }
  if (data.learningGoal.trim().length < 10) {
    errors.learningGoal = 'กรุณาเขียนเป้าหมายอย่างน้อย 10 ตัวอักษร';
  }
  return errors;
}

// TODO 8: แสดง error ใกล้ field และกำหนด aria-invalid
function renderErrors(errors) {
    for (const name of ['displayName', 'learningRole', 'learningGoal']) {
        const field = form.elements[name];
        const output = document.querySelector(`#${name}-error`);
        const message = errors[name] ?? '';

        output.textContent = message;
        field.setAttribute('aria-invalid', String(Boolean(message)));
    }
}

// TODO 9: Read → Render
form.addEventListener('input', () => {
    form.addEventListener('input', () => {
        const data = readForm();
        renderPreview(data);
    });
});

// TODO 10: Read → Validate → Render errors/status
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = readForm();
    const errors = validate(data);
    renderErrors(errors);

    if (Object.keys(errors).length > 0) {
        renderStatus('invalid', 'ยังบันทึกไม่ได้ กรุณาตรวจสอบข้อมูล');
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }
    renderStatus('success', `พร้อมแล้ว ${data.displayName}! ข้อมูลผ่านการตรวจสอบ`);
});

function renderStatus(state, message) {
  status.dataset.state = state;
  status.textContent = message;
}

form.addEventListener('reset', () => {
    queueMicrotask(() => {
        // TODO 11: reset preview, errors และ status
        renderErrors({});
        renderPreview(readForm());
        renderStatus('idle', 'พร้อมเริ่มกรอกข้อมูลใหม่');
    });
});

renderPreview(readForm());
renderStatus('idle', 'เริ่มพิมพ์เพื่อทดลอง Event และ Live Preview');