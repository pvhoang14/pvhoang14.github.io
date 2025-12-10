// --- Data: Publications (Extracted from CV) ---
const publications = [
    {
        title: "ClaimPKG: Enhancing Claim Verification via Pseudo-Subgraph Generation with Lightweight Specialized LLM",
        authors: "Hoang Pham*, Thanh-Do Nguyen*, Khac-Hoai Nam Bui",
        venue: "Findings of ACL 2025 (CORE A*)",
        year: 2025,
        tags: ["NLP", "Graph", "Fact-Checking"],
        links: { pdf: "#", code: "#" }
    },
    {
        title: "Verify-in-the-Graph: Entity Disambiguation Enhancement for Complex Claim Verification with Interactive Graph Representation",
        authors: "Hoang Pham, Thanh-Do Nguyen, Khac-Hoai Nam Bui",
        venue: "NAACL 2025 (CORE A)",
        year: 2025,
        tags: ["NLP", "Graph"],
        links: { pdf: "#", code: "#" }
    },
    {
        title: "Spec-TOD: A Specialized Instruction-Tuned LLM Framework for Efficient Task-Oriented Dialogue Systems",
        authors: "Quang Vinh Nguyen, Quang-Chieu Nguyen, Hoang Pham, Khac-Hoai Nam Bui",
        venue: "SIGDIAL 2025",
        year: 2025,
        tags: ["NLP", "Dialogue"],
        links: { pdf: "#", code: "#" }
    },
    {
        title: "Agent-UniRAG: A Trainable Open-Source LLM Agent Framework for Unified Retrieval-Augmented Generation Systems",
        authors: "Hoang Pham, Thuy-Duong Nguyen, Khac-Hoai Nam Bui",
        venue: "Preprint",
        year: 2024,
        tags: ["NLP", "Agent", "RAG"],
        links: { pdf: "https://arxiv.org/abs/2505.22571", code: "#" }
    }
];

// --- Functions ---

// 1. Navigation Logic
function navigate(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show target section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('fade-in');
    }

    // Update Nav State
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'text-brand', 'font-bold', 'bg-gray-50', 'border-l-4', 'border-brand');
        item.classList.add('text-gray-600', 'border-transparent');

        // Check if this link corresponds to the section
        const linkHref = item.getAttribute('href').substring(1);
        if (linkHref === sectionId) {
            item.classList.add('active');
            item.classList.remove('text-gray-600', 'border-transparent');
        }
    });

    // Close mobile menu if open
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar.classList.contains('hidden') && window.innerWidth < 768) {
        toggleMenu();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// 2. Publication Rendering
function renderPublications(filter = 'all') {
    const container = document.getElementById('publications-list');
    container.innerHTML = '';

    let filtered = publications;
    if (filter !== 'all') {
        filtered = publications.filter(p => p.tags.includes(filter));
    }

    // Group by year
    const years = [...new Set(filtered.map(p => p.year))].sort((a, b) => b - a);

    years.forEach(year => {
        const yearHeader = document.createElement('h3');
        yearHeader.className = "text-xl font-bold text-gray-400 border-b border-gray-200 pb-2 mb-4 mt-8 first:mt-0";
        yearHeader.innerText = year;
        container.appendChild(yearHeader);

        const yearPubs = filtered.filter(p => p.year === year);

        yearPubs.forEach(pub => {
            const pubDiv = document.createElement('div');
            pubDiv.className = "mb-6 pl-4 border-l-2 border-transparent hover:border-brand transition duration-300";

            // Highlight author name
            const formattedAuthors = pub.authors.replace("Hoang Pham", "<strong class='text-gray-900'>Hoang Pham</strong>");

            let tagsHtml = pub.tags.map(t => `<span class="inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded mr-1">${t}</span>`).join('');

            pubDiv.innerHTML = `
                <h4 class="text-lg font-medium text-gray-900 leading-tight">${pub.title}</h4>
                <p class="text-sm text-gray-600 mt-1">${formattedAuthors}</p>
                <div class="flex items-center gap-3 mt-1">
                     <span class="text-sm italic text-gray-500">${pub.venue}</span>
                     ${tagsHtml}
                </div>
                <div class="flex gap-3 mt-2 text-xs font-bold font-sans">
                    <a href="${pub.links.pdf}" class="text-brand hover:underline px-2 py-1 border border-brand rounded hover:bg-brand hover:text-white transition">PDF</a>
                    <a href="${pub.links.code}" class="text-gray-600 hover:text-gray-900 hover:underline px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition">Code</a>
                    <a href="#" class="text-gray-400 hover:text-gray-600">BibTeX</a>
                </div>
            `;
            container.appendChild(pubDiv);
        });
    });
}

function filterPubs(category, btn) {
    // Update button styles
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-brand', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
    });
    btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');
    btn.classList.add('bg-brand', 'text-white', 'shadow-sm');

    renderPublications(category);
}

// 3. Mobile Menu Toggle
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
}

document.getElementById('mobile-menu-btn').addEventListener('click', toggleMenu);

// 4. News Toggle
function toggleNews() {
    const hiddenItems = document.querySelectorAll('.news-hidden');
    const btn = document.getElementById('news-toggle');

    hiddenItems.forEach(item => {
        if (item.classList.contains('hidden')) {
            item.classList.remove('hidden');
            item.classList.add('fade-in');
            btn.innerText = "Show Less";
        } else {
            item.classList.add('hidden');
            item.classList.remove('fade-in');
            btn.innerText = "Show More";
        }
    });
}

// Initialize
window.onload = () => {
    renderPublications();
    // Handle URL hashes on load
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigate(hash);
    }
};
