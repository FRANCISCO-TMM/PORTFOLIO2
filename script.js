    // Initialize Lucide icons
    function initIcons() {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }

    // Mobile menu functionality
    function initMobileMenu() {
      const menuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      let menuOpen = false;

      if (!menuBtn || !mobileMenu) return;

      menuBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        
        if (menuOpen) {
          mobileMenu.classList.remove('hidden');
          mobileMenu.classList.add('mobile-menu');
          menuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
        } else {
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('mobile-menu');
          menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        }
        
        initIcons();
      });

      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
          menuOpen = false;
          initIcons();
        });
      });
    }

    // Blog search and filter functionality
    let searchTimeout = null;

    function initBlogSearch() {
      const searchInput = document.getElementById('search-input');
      const clearBtn = document.getElementById('clear-search');
      const blogGrid = document.getElementById('blog-grid');
      const noResults = document.getElementById('no-results');
      
      if (!searchInput || !blogGrid) return;

      const blogCards = Array.from(blogGrid.querySelectorAll('.blog-card'));

      function filterAndHighlight() {
        const filter = searchInput.value.toLowerCase().trim();
        
        let visibleCount = 0;

        blogCards.forEach(card => {
          const title = (card.dataset.title || '').toLowerCase();
          const desc = (card.dataset.desc || '').toLowerCase();
          const content = title + ' ' + desc;
          
          resetHighlights(card);

          if (!filter) {
            card.style.display = '';
            visibleCount++;
            return;
          }

          if (content.includes(filter)) {
            card.style.display = '';
            visibleCount++;
            highlightTextInElement(card, filter);
          } else {
            card.style.display = 'none';
          }
        });

        if (visibleCount === 0 && filter) {
          noResults.classList.remove('hidden');
          blogGrid.classList.add('hidden');
        } else {
          noResults.classList.add('hidden');
          blogGrid.classList.remove('hidden');
        }

        if (filter) {
          clearBtn.classList.remove('hidden');
          clearBtn.classList.add('flex');
        } else {
          clearBtn.classList.add('hidden');
          clearBtn.classList.remove('flex');
        }
      }

      function highlightTextInElement(element, filter) {
        const textNodes = getTextNodes(element);
        
        textNodes.forEach(node => {
          const text = node.nodeValue;
          if (!text) return;
          
          const lowerText = text.toLowerCase();
          let lastIndex = 0;
          const parent = node.parentNode;
          const fragment = document.createDocumentFragment();
          
          let matchIndex;
          while ((matchIndex = lowerText.indexOf(filter, lastIndex)) !== -1) {
            if (matchIndex > lastIndex) {
              fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
            }
            
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = text.substring(matchIndex, matchIndex + filter.length);
            fragment.appendChild(span);
            
            lastIndex = matchIndex + filter.length;
          }
          
          if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
          }
          
          if (fragment.childNodes.length > 0) {
            parent.replaceChild(fragment, node);
          }
        });
      }

      function getTextNodes(node) {
        const nodes = [];
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
        let currentNode;
        while ((currentNode = walker.nextNode())) {
          if (currentNode.nodeValue.trim() !== '') {
            nodes.push(currentNode);
          }
        }
        return nodes;
      }

      function resetHighlights(element) {
        element.querySelectorAll('.highlight').forEach(el => {
          const parent = el.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
          }
        });
      }

      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterAndHighlight, 120);
      });

      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterAndHighlight();
        searchInput.focus();
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          filterAndHighlight();
        }
      });

      clearBtn.classList.add('hidden');
    }

    function clearSearch() {
      const searchInput = document.getElementById('search-input');
      const noResults = document.getElementById('no-results');
      const blogGrid = document.getElementById('blog-grid');
      
      if (searchInput) searchInput.value = '';
      
      document.querySelectorAll('#blog-grid .blog-card').forEach(card => {
        card.style.display = '';
        card.querySelectorAll('.highlight').forEach(el => {
          const parent = el.parentNode;
          parent.replaceChild(document.createTextNode(el.textContent), el);
          parent.normalize();
        });
      });
      
      noResults.classList.add('hidden');
      blogGrid.classList.remove('hidden');
      
      const clearBtn = document.getElementById('clear-search');
      if (clearBtn) {
        clearBtn.classList.add('hidden');
        clearBtn.classList.remove('flex');
      }
    }

    // Smooth scroll
    function initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }

    // Main initialization
    function init() {
      initIcons();
      initMobileMenu();
      initBlogSearch();
      initSmoothScroll();
      
      document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName === 'BODY') {
          e.preventDefault();
          const search = document.getElementById('search-input');
          if (search) search.focus();
        }
      });

      console.log('%c[Deborah Christopher Portfolio] Personalized portfolio ready. Press "/" to focus search.', 'color:#8a857d');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
