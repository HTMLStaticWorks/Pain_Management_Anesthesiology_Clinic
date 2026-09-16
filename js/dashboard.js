// Patient Portal Dashboard Logic for ApexPain

let overviewChart;
let fullProgressChart;

document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme and RTL direction
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const isRtl = localStorage.getItem('rtl') === 'true';
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

  // Init charts
  initOverviewChart();
  initProgressChart();

  // Shop / Directory filtering
  const wallFilter = document.getElementById('routeWallFilter');
  const gradeFilter = document.getElementById('routeGradeFilter');
  if (wallFilter && gradeFilter) {
    [wallFilter, gradeFilter].forEach(el => {
      el.addEventListener('change', filterRoutes);
    });
  }

  // Log Search & Filtering (Order History)
  const logSearch = document.getElementById('logSearch');
  const logGradeFilter = document.getElementById('logGradeFilter');
  if (logSearch && logGradeFilter) {
    logSearch.addEventListener('input', filterLogs);
    logGradeFilter.addEventListener('change', filterLogs);
  }
});

// Panel Switcher
function showSection(sectionId) {
  // Hide all panels
  document.querySelectorAll('.dashboard-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  // Remove active styling from sidebar buttons
  document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.classList.remove('active');
  });

  // Remove active styling from mobile menu buttons
  document.querySelectorAll('.mobile-nav-link').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show active panel
  const targetPanel = document.getElementById('panel-' + sectionId);
  if (targetPanel) {
    targetPanel.classList.remove('hidden');
  }

  // Highlight active button
  const targetBtn = document.getElementById('nav-' + sectionId);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }

  // Highlight active mobile menu button
  const targetMobileBtn = document.getElementById('mobile-nav-' + sectionId);
  if (targetMobileBtn) {
    targetMobileBtn.classList.add('active');
  }
}

// Chart.js Inits
function initOverviewChart() {
  const ctx = document.getElementById('overviewChart');
  if (!ctx) return;

  overviewChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [{
        label: 'Pain Score (VAS 1-10)',
        data: [8, 7, 5, 4, 3, 2],
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.15)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 10,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#9CA3AF' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#9CA3AF' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function initProgressChart() {
  const ctx = document.getElementById('fullProgressChart');
  if (!ctx) return;

  fullProgressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Procedure Relief %',
        data: [20, 35, 55, 70, 85, 92],
        borderColor: '#0284C7',
        backgroundColor: 'rgba(2, 132, 199, 0.15)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: {
            color: '#9CA3AF',
            callback: function (value) {
              return value + '%';
            }
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#9CA3AF' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Log Session / Prescription Handlers
let logModal;
function openLogModal() {
  if (!logModal) {
    logModal = new bootstrap.Modal(document.getElementById('logClimbModal'));
  }
  logModal.show();
}

function triggerQuickLog() {
  openLogModal();
}

function submitClimbLog(event) {
  event.preventDefault();

  const nameInput = document.getElementById('logRouteName'); // Medicine Name
  const gradeSelect = document.getElementById('logRouteGrade'); // Category
  const attemptsInput = document.getElementById('logRouteAttempts'); // Qty

  if (!nameInput.value) return;

  // Calculate mock cost based on quantity
  const price = (attemptsInput.value * 14.99).toFixed(2);

  // Add new row to Session Log table (Order History)
  const tbody = document.querySelector('#climbLogTable tbody');
  const today = new Date().toISOString().split('T')[0];

  const rowHtml = `
    <tr>
      <td class="py-3 px-4 text-gray-500">${today}</td>
      <td class="py-3 px-4 font-medium">${nameInput.value}</td>
      <td class="py-3 px-4"><span class="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981]">${gradeSelect.value}</span></td>
      <td class="py-3 px-4 text-center">${attemptsInput.value}</td>
      <td class="py-3 px-4 text-right text-violet-400">$${price}</td>
    </tr>
  `;
  tbody.insertAdjacentHTML('afterbegin', rowHtml);

  // Close Modal
  if (logModal) logModal.hide();

  // Reset inputs
  nameInput.value = '';
  attemptsInput.value = '1';

  // Blast Confetti Celebration!
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Badge achievements unlock triggers
function clickBadge(badgeTitle) {
  alert(`Health Milestone: ${badgeTitle}! Thank you for staying proactive with Health Store!`);
}

function unlockFiftyBadge() {
  const badge = document.getElementById('badge-50');
  const label = document.getElementById('badge-50-label');

  if (badge && badge.classList.contains('badge-locked')) {
    badge.classList.remove('badge-locked');
    label.innerText = 'Unlocked';
    confetti({
      particleCount: 150,
      colors: ['#34D399', '#10B981']
    });
    alert('Congratulations! You unlocked the "Adherence Hero" badge milestone!');
  } else {
    alert('You have already unlocked the "Adherence Hero" badge!');
  }
}

// Product Directory filters
function filterRoutes() {
  const wall = document.getElementById('routeWallFilter').value;
  const grade = document.getElementById('routeGradeFilter').value;
  const cards = document.querySelectorAll('#routesGrid > div');

  cards.forEach(card => {
    const cardWall = card.getAttribute('data-wall');
    const cardGrade = card.getAttribute('data-grade');

    const wallMatch = (wall === 'all' || cardWall === wall);
    const gradeMatch = (grade === 'all' || cardGrade === grade);

    if (wallMatch && gradeMatch) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// Search and Filter Logs
function filterLogs() {
  const query = document.getElementById('logSearch').value.toLowerCase();
  const grade = document.getElementById('logGradeFilter').value;
  const rows = document.querySelectorAll('#climbLogTable tbody tr');

  rows.forEach(row => {
    const routeName = row.children[1].innerText.toLowerCase();
    const routeGrade = row.children[2].innerText.trim();

    const searchMatch = routeName.includes(query);
    const gradeMatch = (grade === 'all' || routeGrade === grade);

    if (searchMatch && gradeMatch) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}
