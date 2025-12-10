// Data storage
let publications = [];
let news = [];
let newsConfig = { minVisible: 5 }; // Default config
let research = null;
let experience = null;
let teaching = null;
let home = null;

async function loadData() {
    try {
        const [pubRes, newsRes, researchRes, experienceRes, teachingRes, homeRes] = await Promise.all([
            fetch('data/publications.yml'),
            fetch('data/news.yml'),
            fetch('data/research.yml'),
            fetch('data/experience.yml'),
            fetch('data/teaching.yml'),
            fetch('data/home.yml')
        ]);

        const pubText = await pubRes.text();
        const newsText = await newsRes.text();
        const researchText = await researchRes.text();
        const experienceText = await experienceRes.text();
        const teachingText = await teachingRes.text();
        const homeText = await homeRes.text();

        publications = jsyaml.load(pubText);
        const newsData = jsyaml.load(newsText);
        // Handle both old format (array) and new format (object with config and items)
        if (Array.isArray(newsData)) {
            news = newsData;
        } else {
            news = newsData.items || [];
            if (newsData.config) {
                newsConfig = newsData.config;
            }
        }
        research = jsyaml.load(researchText);
        experience = jsyaml.load(experienceText);
        teaching = jsyaml.load(teachingText);
        home = jsyaml.load(homeText);

        // Render all content after data is loaded
        renderHome();
        renderNews();
        renderResearch();
        renderExperience();
        renderTeaching();
        renderPublications();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Navigation function
function navigate(sectionId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('fade-in');
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'text-brand', 'font-bold', 'bg-gray-50', 'border-l-4', 'border-brand');
        item.classList.add('text-gray-600', 'border-transparent');

        const linkHref = item.getAttribute('href').substring(1);
        if (linkHref === sectionId) {
            item.classList.add('active');
            item.classList.remove('text-gray-600', 'border-transparent');
        }
    });

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar.classList.contains('hidden') && window.innerWidth < 768) {
        toggleMenu();
    }

    window.scrollTo(0, 0);
}

// Render publications
function renderPublications(filter = 'all') {
    const container = document.getElementById('publications-list');
    if (!container) return;

    container.innerHTML = '';

    let filtered = publications;
    if (filter !== 'all') {
        filtered = publications.filter(p => p.tags.includes(filter));
    }

    const years = [...new Set(filtered.map(p => p.year))].sort((a, b) => b - a);

    years.forEach(year => {
        const yearHeader = document.createElement('h3');
        yearHeader.className = "text-xl font-bold text-gray-500 border-b border-gray-200 pb-2 mb-4 mt-8 first:mt-0";
        yearHeader.innerText = year;
        container.appendChild(yearHeader);

        const yearPubs = filtered.filter(p => p.year === year);

        yearPubs.forEach(pub => {
            const pubDiv = document.createElement('div');
            pubDiv.className = "mb-6 pl-4 border-l-2 border-transparent hover:border-brand transition duration-300";

            const formattedAuthors = pub.authors.replace(/Hoang Pham/g, "<strong class='text-gray-900'>Hoang Pham</strong>");
            const tagsHtml = pub.tags.map(t =>
                `<span class="inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded mr-1">${t}</span>`
            ).join('');

            const descriptionHtml = pub.description ?
                `<p class="text-sm text-gray-600 mt-2 leading-relaxed">${pub.description}</p>` : '';

            pubDiv.innerHTML = `
                <h4 class="text-lg font-medium text-gray-900 leading-tight">${pub.title}</h4>
                <p class="text-sm text-gray-600 mt-1">${formattedAuthors}</p>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-sm italic text-gray-500">${pub.venue}</span>
                    ${tagsHtml}
                </div>
                ${descriptionHtml}
                <div class="flex gap-2 mt-2 text-xs font-bold font-sans">
                    <a href="${pub.links.pdf}" class="text-brand hover:underline px-0.5 py-0.5 border border-brand rounded hover:bg-brand hover:text-white transition">PDF</a>
                    <a href="${pub.links.code}" class="text-brand hover:underline px-0.5 py-0.5 border border-brand rounded hover:bg-brand hover:text-white transition">Code</a>
                </div>
            `;
            container.appendChild(pubDiv);
        });
    });
}

// Render selected publications on home page
function renderHome() {
    if (!home || !publications.length) return;

    const container = document.querySelector('#home .lg\\:col-span-2 > .space-y-4');
    if (!container) return;

    // Support selecting specific publications by index, or fall back to count
    let selectedPubs = [];
    if (home.selectedPublications && Array.isArray(home.selectedPublications)) {
        // Select publications by their indices (0-based)
        selectedPubs = home.selectedPublications
            .map(index => publications[index])
            .filter(pub => pub !== undefined); // Filter out invalid indices
    } else {
        // Fall back to taking first N publications
        const count = home.selectedPublicationsCount || 3;
        selectedPubs = publications.slice(0, count);
    }

    container.innerHTML = '';

    selectedPubs.forEach(pub => {
        const pubDiv = document.createElement('div');
        pubDiv.className = "group";

        const formattedAuthors = pub.authors.replace(/Hoang Pham/g, "<strong>Hoang Pham</strong>");

        const descriptionHtml = pub.description ?
            `<p class="text-sm text-gray-600 mt-2 leading-relaxed">${pub.description}</p>` : '';

        pubDiv.innerHTML = `
            <h4 class="text-lg font-bold text-gray-900 group-hover:text-brand transition cursor-pointer">
                <a href="#">${pub.title}</a>
            </h4>
            <div class="flex items-center gap-3 mt-1 flex-wrap">
                <p class="text-gray-500 text-sm italic">${pub.venue}</p>
                <div class="flex gap-3 text-xs font-semibold">
                    <a href="${pub.links.pdf}" class="text-brand hover:underline">[PDF]</a>
                    <a href="${pub.links.code}" class="text-brand hover:underline">[Code]</a>
                </div>
            </div>
            <p class="text-gray-600 text-sm mt-2">${formattedAuthors}</p>
            ${descriptionHtml}
        `;
        container.appendChild(pubDiv);
    });
}

// Render news
function renderNews() {
    if (!news.length) {
        // Hide toggle button if no news
        const toggleBtn = document.getElementById('news-toggle');
        if (toggleBtn) toggleBtn.classList.add('hidden');
        return;
    }

    const container = document.getElementById('news-container');
    const toggleBtn = document.getElementById('news-toggle');
    if (!container) return;

    const minVisible = newsConfig.minVisible || 5;
    container.innerHTML = '';

    // Count non-hidden items (items not marked as hidden in data)
    const nonHiddenCount = news.filter(item => !item.hidden).length;

    // We need to show at least minVisible items
    // If we have fewer non-hidden items than minVisible, we'll show some hidden items
    const targetVisible = Math.max(minVisible, nonHiddenCount);

    let visibleCount = 0;
    let hasHiddenItems = false;

    // Render all items
    news.forEach((item, index) => {
        const newsDiv = document.createElement('div');

        // Determine initial visibility
        const isDataHidden = item.hidden === true;
        let isInitiallyHidden = false;

        if (isDataHidden) {
            // For items marked as hidden in data, only show them if we need to meet minVisible
            isInitiallyHidden = visibleCount >= targetVisible;
        }
        // Items not marked as hidden are always visible

        if (!isInitiallyHidden) {
            visibleCount++;
        } else {
            hasHiddenItems = true;
        }

        newsDiv.className = `relative ${isInitiallyHidden ? 'news-hidden hidden' : ''}`;
        const dotColor = item.highlighted ? 'bg-brand' : 'bg-gray-300';

        newsDiv.innerHTML = `
            <span class="absolute -left-[21px] top-1 h-3 w-3 rounded-full ${dotColor} ring-4 ring-white"></span>
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">${item.date}</p>
            <p class="text-sm text-gray-700 mt-1">${item.content}</p>
        `;
        container.appendChild(newsDiv);
    });

    // Show/hide toggle button based on whether there are hidden items
    if (toggleBtn) {
        if (hasHiddenItems) {
            toggleBtn.classList.remove('hidden');
            toggleBtn.innerText = "Show More";
        } else {
            toggleBtn.classList.add('hidden');
        }
    }
}

// Render research projects
function renderResearch() {
    if (!research) return;

    const projectsContainer = document.querySelector('#research .grid.grid-cols-1.md\\:grid-cols-2');
    const openSourceContainer = document.querySelector('#research .bg-white.rounded-lg ul');

    // Render projects
    if (projectsContainer && research.projects) {
        projectsContainer.innerHTML = '';
        research.projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group";

            const tagColorClass = project.tagColor === 'blue' ? 'bg-blue-50 text-blue-600' :
                project.tagColor === 'green' ? 'bg-green-50 text-green-600' :
                    'bg-gray-50 text-gray-600';

            const linksHtml = Object.entries(project.links || {}).map(([key, url]) => {
                if (key === 'demo') {
                    return `<a href="${url}" class="text-xs font-bold text-brand border border-brand px-2.5 py-0.5 rounded hover:bg-brand hover:text-white transition">Demo</a>`;
                } else if (key === 'code') {
                    return `<a href="${url}" class="text-xs font-bold text-gray-600 border border-gray-300 px-2.5 py-0.5 rounded hover:bg-gray-800 hover:text-white transition"><i class="fab fa-github mr-1"></i> Code</a>`;
                }
                return '';
            }).join('');

            projectDiv.innerHTML = `
                <div class="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    <i class="fas ${project.icon} text-4xl text-gray-300 group-hover:scale-110 transition duration-500"></i>
                </div>
                <div class="p-5">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-xl font-bold text-gray-900">${project.title}</h3>
                        <span class="text-xs font-bold px-1.5 py-0.5 ${tagColorClass} rounded">${project.tag}</span>
                    </div>
                    <p class="text-gray-600 text-sm mb-4">${project.description}</p>
                    <div class="flex gap-3">${linksHtml}</div>
                </div>
            `;
            projectsContainer.appendChild(projectDiv);
        });
    }

    // Render open source
    if (openSourceContainer && research.openSource) {
        openSourceContainer.innerHTML = '';
        research.openSource.forEach(item => {
            const li = document.createElement('li');
            li.className = "flex items-start";
            li.innerHTML = `
                <i class="fas ${item.icon} mt-1 text-brand mr-3"></i>
                <div>
                    <strong class="text-gray-800">${item.name}</strong>
                    <p class="text-sm text-gray-600">${item.description}</p>
                </div>
            `;
            openSourceContainer.appendChild(li);
        });
    }
}

// Render experience
function renderExperience() {
    if (!experience) return;

    const educationContainer = document.querySelector('#experience .space-y-8 > div:first-child .border-l-2');
    const workContainer = document.querySelector('#experience .space-y-8 > div:last-child .border-l-2');

    // Render education
    if (educationContainer && experience.education) {
        educationContainer.className = "border-l-2 border-gray-200 ml-5 pl-8 space-y-6";
        educationContainer.innerHTML = '';
        experience.education.forEach(edu => {
            const eduDiv = document.createElement('div');
            eduDiv.className = "relative";

            const dotColor = edu.highlighted ? 'bg-brand' : 'bg-gray-400';
            const detailsHtml = edu.details ?
                (Array.isArray(edu.details) ?
                    edu.details.map(d => `<p class="text-sm text-gray-600 mt-1">${d}</p>`).join('') :
                    `<p class="text-sm text-gray-600 mt-1">${edu.details}</p>`) :
                '';

            eduDiv.innerHTML = `
                <span class="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white ${dotColor}"></span>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                    <h4 class="text-lg font-bold text-gray-900">${edu.institution}</h4>
                    <span class="text-sm font-medium text-gray-500">${edu.period}</span>
                </div>
                <p class="text-gray-700 italic">${edu.degree}</p>
                ${detailsHtml}
            `;
            educationContainer.appendChild(eduDiv);
        });
    }

    // Render work
    if (workContainer && experience.work) {
        workContainer.innerHTML = '';
        experience.work.forEach(job => {
            const jobDiv = document.createElement('div');
            jobDiv.className = "relative";

            const dotColor = job.highlighted ? 'bg-brand' : 'bg-gray-400';

            let detailsHtml = '';
            if (job.responsibilities) {
                detailsHtml = `<ul class="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">${job.responsibilities.map(r => `<li>${r}</li>`).join('')
                    }</ul>`;
            } else if (job.details) {
                detailsHtml = `<p class="text-sm text-gray-600 mt-1">${job.details}</p>`;
            }

            jobDiv.innerHTML = `
                <span class="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white ${dotColor}"></span>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                    <h4 class="text-lg font-bold text-gray-900">${job.company}</h4>
                    <span class="text-sm font-medium text-gray-500">${job.period}</span>
                </div>
                <p class="text-gray-700 italic">${job.position}</p>
                ${detailsHtml}
            `;
            workContainer.appendChild(jobDiv);
        });
    }
}

// Render teaching
function renderTeaching() {
    if (!teaching) return;

    const teachingContainer = document.querySelector('#teaching .grid .space-y-2');
    const serviceContainer = document.querySelector('#teaching .grid .bg-white.rounded-lg');

    // Render teaching
    if (teachingContainer && teaching.teaching) {
        teachingContainer.innerHTML = '';
        teaching.teaching.forEach(course => {
            const li = document.createElement('li');
            li.className = "bg-white border border-gray-200 p-3 rounded-lg shadow-sm";
            li.innerHTML = `
                <div class="flex justify-between">
                    <span class="font-bold text-gray-900">${course.course}</span>
                    <span class="text-xs font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">${course.semester}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">${course.institution}</p>
            `;
            teachingContainer.appendChild(li);
        });
    }

    // Render service
    if (serviceContainer && teaching.service) {
        const reviewerHtml = teaching.service.reviewer ? `
            <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <p class="font-bold text-gray-700 mb-2">Conference Reviewer</p>
                <ul class="list-disc list-inside text-gray-600 text-sm space-y-1">
                    ${teaching.service.reviewer.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        const talksHtml = teaching.service.talks ? `
            <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm mt-3">
                <p class="font-bold text-gray-700 mb-2">Tutorials & Talks</p>
                <ul class="list-disc list-inside text-gray-600 text-sm space-y-1">
                    ${teaching.service.talks.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        serviceContainer.innerHTML = reviewerHtml + talksHtml;
    }
}

// Filter publications
function filterPubs(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-brand', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
    });
    btn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');
    btn.classList.add('bg-brand', 'text-white', 'shadow-sm');

    renderPublications(category);
}

// Toggle mobile menu
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
}

// Toggle news visibility
function toggleNews() {
    const hiddenItems = document.querySelectorAll('.news-hidden');
    const btn = document.getElementById('news-toggle');

    if (!btn || hiddenItems.length === 0) {
        // Hide button if no hidden items
        if (btn) btn.classList.add('hidden');
        return;
    }

    // Check if any items are currently hidden
    const hasHidden = Array.from(hiddenItems).some(item => item.classList.contains('hidden'));

    if (hasHidden) {
        // Show all hidden items
        hiddenItems.forEach(item => {
            item.classList.remove('hidden');
            item.classList.add('fade-in');
        });
        btn.innerText = "Show Less";
    } else {
        // Hide items that were initially hidden
        hiddenItems.forEach(item => {
            item.classList.add('hidden');
            item.classList.remove('fade-in');
        });
        btn.innerText = "Show More";
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleMenu);

    loadData().then(() => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            navigate(hash);
        }
    });
});
