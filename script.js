function toggleMenu(){
  const el=document.getElementById('mobileMenu');
  const btn=document.querySelector('.menu-btn');
  if(!el || !btn) return;
  
  if(el.style.display==='none' || !el.style.display){
    el.style.display='block';
    btn.classList.add('active');
  } else {
    el.style.display='none';
    btn.classList.remove('active');
  }
}

function filterCategory(cat) {
  const cards = document.querySelectorAll("#projectGrid .card");
  cards.forEach((c) => {
    c.style.display = cat === "all" || c.dataset.category === cat ? "" : "none";
  });

  // Update active button state
  const buttons = document.querySelectorAll(".btn.secondary");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to clicked button
  event.target.classList.add("active");
}

function paginate() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;
  for (let i = 0; i < 3; i++) {
    const a = document.createElement("a");
    a.className = "card project-card";
    a.href = "project.html";
    a.setAttribute("data-category", i % 2 ? "commercial" : "residential");
    a.innerHTML = `<img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4MDAnIGhlaWdodD0nNjAwJz4KICA8cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZTVlN2ViJy8+CiAgPHRleHQgeD0nNTAlJyB5PSc1MCUnIGRvbWluYW50LWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnIGZpbGw9JyM5Y2EzYWYnIGZvbnQtZmFtaWx5PSdBcmlhbCcgZm9udC1zaXplPScxNCc+UHJvamVjdDwvdGV4dD4KPC9zdmc+' alt='Project'>
      <div class="content">
        <div class="project-meta"><span>${
          i % 2 ? "Commercial" : "Residential"
        }</span><span>CA</span></div>
        <h3>New Project ${Math.floor(Math.random() * 100)}</h3>
      </div>`;
    grid.appendChild(a);
  }
}
