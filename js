const FORM_CONFIG = {
  title: "EMBEDDED SYS & IOT - (SALEM)",
  description: "Registration form for Embedded Systems & IoT (Salem)",
  webhook: "",
  fields: [
    { id: "email", label: "Email", type: "email", placeholder: "your@email.com", required: true },
    { id: "name", label: "Name", type: "text", placeholder: "Your full name", required: true },
    { id: "college", label: "College Name", type: "radio", required: true, options: [
      "Shree Sathyam College of Engineering and Technology",
      "GOVERNMENT COLLEGE OF ENGINEERING - SALEM",
      "AVS Engineering College - (Batch 1)",
      "AVS Engineering College - (Batch 2)",
      "Bharathiyar Institute of Engineering for Women",
      "Ganesh College of Engineering",
      "MAHENDRA COLLEGE OF ENGINEERING",
      "SALEM COLLEGE OF ENGINEERING AND TECHNOLOGY - (Batch 1)",
      "SALEM COLLEGE OF ENGINEERING AND TECHNOLOGY - (Batch 2)",
      "Tagore Institute of Engineering and Technology",
      "VSA GROUP OF INSTITUTIONS",
      "AVS COLLEGE OF TECHNOLOGY"
    ] },
    { id: "attendance", label: "Attendance (Upload PDF or Doc)", type: "file", accept: ".pdf,.doc,.docx", required: true, maxSizeMB: 10 },
    { id: "geotag", label: "Geotag Images", type: "file", accept: "image/*", required: true, maxSizeMB: 10 },
    { id: "video", label: "Video Upload", type: "file", accept: "video/*", required: false, maxSizeMB: 100 },
    { id: "date", label: "Date", type: "date", required: true },
    { id: "day", label: "Day", type: "radio", required: true, options: [
      "DAY 1","DAY 2","DAY 3","DAY 4","DAY 5","DAY 6","DAY 7","DAY 8","DAY 9","DAY 10","DAY 11","DAY 12"
    ] }
  ]
};

const submissions = [];
const $ = (s, root=document) => root.querySelector(s);

document.addEventListener('DOMContentLoaded', () => {
  $('#dynamicForm').innerHTML = '';
  FORM_CONFIG.fields.forEach(field => renderField(field));
  $('#submitBtn').addEventListener('click', handleSubmit);
  $('#exportCSV').addEventListener('click', exportCSV);
  $('#exportXLSX').addEventListener('click', exportXLSX);
});

function renderField(field) {
  const form = $('#dynamicForm');
  const wrapper = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = field.label;
  label.className = 'block font-medium';
  if (field.required) label.classList.add('required-asterisk');

  let input;
  if (field.type === 'radio') {
    input = document.createElement('div');
    field.options.forEach((opt, i) => {
      const id = `${field.id}-${i}`;
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = field.id;
      radio.id = id;
      radio.value = opt;
      radio.required = field.required;

      const lab = document.createElement('label');
      lab.setAttribute('for', id);
      lab.textContent = opt;
      lab.className = 'ml-2 mr-4';

      const div = document.createElement('div');
      div.className = 'flex items-center';
      div.appendChild(radio);
      div.appendChild(lab);
      input.appendChild(div);
    });
  } else if (field.type === 'file') {
    input = document.createElement('input');
    input.type = 'file';
    if (field.accept) input.accept = field.accept;
    if (field.required) input.required = true;
  } else {
    input = document.createElement('input');
    input.type = field.type;
    input.placeholder = field.placeholder || '';
    input.id = field.id;
    input.name = field.id;
    input.required = field.required;
    input.className = 'w-full border rounded p-2';
  }

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  form.appendChild(wrapper);
}

function handleSubmit(e) {
  e.preventDefault();
  const formEl = $('#dynamicForm');
  if (!formEl.checkValidity()) {
    formEl.reportValidity();
    return;
  }

  const formData = {};
  FORM_CONFIG.fields.forEach(f => {
    if (f.type === 'radio') {
      const val = document.querySelector(`input[name="${f.id}"]:checked`);
      formData[f.id] = val ? val.value : '';
    } else if (f.type === 'file') {
      formData[f.id] = $(`#${f.id}`)?.files?.[0]?.name || '';
    } else {
      formData[f.id] = $(`#${f.id}`)?.value || '';
    }
  });
  submissions.push(formData);

  alert('Form submitted successfully! Data stored locally.');
  formEl.reset();
}

function exportCSV() {
  if (!submissions.length) return alert("No submissions yet!");
  const headers = Object.keys(submissions[0]);
  const rows = submissions.map(obj => headers.map(h => JSON.stringify(obj[h] || "")));
  const csv = [headers.join(",")].concat(rows.map(r => r.join(","))).join("\n");
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'submissions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function exportXLSX() {
  if (!submissions.length) return alert("No submissions yet!");
  const ws = XLSX.utils.json_to_sheet(submissions);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Submissions");
  XLSX.writeFile(wb, "submissions.xlsx");
}
