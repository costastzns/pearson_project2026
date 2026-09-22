const courses = [
  { id: 1, category: 'design', categoryName: 'Design & Δημιουργικότητα', title: 'Σκέψου διαφορετικά', description: 'Τεχνικές δημιουργικής σκέψης για να μετατρέπεις την περιέργεια σε ιδέες που έχουν αξία.', duration: '4 εβδομάδες', level: 'Αρχάριος', rating: '4.9', color: 'visual-blue', code: 'THINK / 01' },
  { id: 2, category: 'technology', categoryName: 'Τεχνολογία & Data', title: 'Ιστορίες με δεδομένα', description: 'Μάθε να διαβάζεις δεδομένα και να παρουσιάζεις καθαρά όσα πραγματικά σημαίνουν.', duration: '6 εβδομάδες', level: 'Μεσαίο', rating: '4.8', color: 'visual-yellow', code: 'DATA / 02' },
  { id: 3, category: 'business', categoryName: 'Business & Καριέρα', title: 'Βρες τη φωνή σου', description: 'Χτίσε μια αυθεντική επαγγελματική ταυτότητα και επικοινώνησε με αυτοπεποίθηση.', duration: '3 εβδομάδες', level: 'Αρχάριος', rating: '4.9', color: 'visual-coral', code: 'VOICE / 03' },
  { id: 4, category: 'technology', categoryName: 'Τεχνολογία & Data', title: 'Κώδικας για όλους', description: 'Η πρώτη σου γνωριμία με τη λογική του προγραμματισμού, χωρίς προηγούμενη εμπειρία.', duration: '8 εβδομάδες', level: 'Αρχάριος', rating: '4.7', color: 'visual-green', code: 'CODE / 04' },
  { id: 5, category: 'wellbeing', categoryName: 'Ευεξία & Ανάπτυξη', title: 'Ηρεμία στην πράξη', description: 'Μικρές καθημερινές συνήθειες για περισσότερη συγκέντρωση, ενέργεια και ισορροπία.', duration: '2 εβδομάδες', level: 'Όλα τα επίπεδα', rating: '5.0', color: 'visual-lilac', code: 'CALM / 05' },
  { id: 6, category: 'business', categoryName: 'Business & Καριέρα', title: 'Ηγεσία με ενσυναίσθηση', description: 'Εργαλεία για ομάδες που συνεργάζονται καλύτερα και ηγέτες που ακούν ουσιαστικά.', duration: '5 εβδομάδες', level: 'Μεσαίο', rating: '4.8', color: 'visual-orange', code: 'LEAD / 06' }
];

function setupNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function renderCourses(filter = 'all') {
  const grid = document.querySelector('#course-grid');
  if (!grid) return;
  const emptyState = document.querySelector('#empty-state');
  const filtered = filter === 'all' ? courses : courses.filter((course) => course.category === filter);
  grid.innerHTML = filtered.map((course) => `
    <article class="catalog-card">
      <div class="catalog-card-visual ${course.color}"><span>${course.code}</span><b>${course.id.toString().padStart(2, '0')}</b></div>
      <div class="catalog-card-content">
        <span class="course-tag">${course.categoryName}</span>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta"><span>◷ ${course.duration}</span><span>★ ${course.rating}</span><button class="details-button" type="button" data-course-id="${course.id}">Λεπτομέρειες</button></div>
      </div>
    </article>`).join('');
  emptyState.hidden = filtered.length > 0;
  grid.querySelectorAll('.details-button').forEach((button) => button.addEventListener('click', () => openCourseModal(Number(button.dataset.courseId))));
}

function openCourseModal(courseId) {
  const course = courses.find((item) => item.id === courseId);
  const modal = document.querySelector('#course-modal');
  if (!course || !modal) return;
  document.querySelector('#modal-category').textContent = course.categoryName;
  document.querySelector('#modal-title').textContent = course.title;
  document.querySelector('#modal-description').textContent = course.description;
  document.querySelector('#modal-duration').textContent = `◷ ${course.duration}`;
  document.querySelector('#modal-level').textContent = `⌁ ${course.level}`;
  document.querySelector('#modal-rating').textContent = `★ ${course.rating} / 5`;
  document.querySelector('#modal-register').href = `register.html?course=${encodeURIComponent(course.title)}`;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
  const modal = document.querySelector('#course-modal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

function setupCatalog() {
  const grid = document.querySelector('#course-grid');
  if (!grid) return;
  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get('category') || 'all';
  renderCourses(initialFilter);
  const activeFilter = document.querySelector(`[data-filter="${initialFilter}"]`);
  if (activeFilter) activeFilter.classList.add('active');
  document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderCourses(button.dataset.filter);
  }));
  document.querySelector('.modal-close')?.addEventListener('click', closeCourseModal);
  document.querySelector('#course-modal')?.addEventListener('click', (event) => { if (event.target.id === 'course-modal') closeCourseModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCourseModal(); });
}

function setupRegistration() {
  const form = document.querySelector('#registration-form');
  if (!form) return;
  const courseParam = new URLSearchParams(window.location.search).get('course');
  if (courseParam) {
    const courseSelect = document.querySelector('#course');
    const matchingOption = [...courseSelect.options].find((option) => option.value === courseParam);
    if (matchingOption) courseSelect.value = courseParam;
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const course = document.querySelector('#course');
    const selectedLevel = document.querySelector('input[name="level"]:checked');
    const fields = { name, email, course, level: selectedLevel };
    let isValid = true;
    Object.entries(fields).forEach(([key, field]) => {
      const error = document.querySelector(`[data-error-for="${key}"]`);
      if (error) error.textContent = '';
      if (!field || !field.value.trim()) {
        if (error) error.textContent = key === 'level' ? 'Επίλεξε επίπεδο γνώσεων.' : 'Το πεδίο είναι υποχρεωτικό.';
        isValid = false;
      }
    });
    if (email.value && !email.validity.valid) {
      document.querySelector('[data-error-for="email"]').textContent = 'Συμπλήρωσε ένα έγκυρο email.';
      isValid = false;
    }
    if (!isValid) return;
    document.querySelector('#success-name').textContent = `${name.value.trim()}!`;
    form.hidden = true;
    document.querySelector('#success-message').hidden = false;
  });
  document.querySelector('#new-registration')?.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    document.querySelector('#success-message').hidden = true;
  });
}

document.addEventListener('DOMContentLoaded', () => { setupNavigation(); setupCatalog(); setupRegistration(); });
