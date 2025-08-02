import PageManager from './page-manager';

export default class Post extends PageManager {
    constructor(context) {
        super(context);
        this.context = context;
        this.checkJS_load = true;
    }

    onReady() {
        this.eventLoad();
    }

    loadFunction() {
        if (this.checkJS_load) {
            this.checkJS_load = false;
            this.postTableContents();
            this.initFaqs();
        }
    }

    eventLoad() {
        $(document).on('keydown mousemove touchstart', (e) => {
            this.loadFunction();
        });
    }

    toggleContent() {
        const $toggleTitle = $('.faqAccordion__title');
    
        if (!$toggleTitle) return;
    
        $toggleTitle.on('click', (e) => {
            e.preventDefault();
    
            const $target = $(e.currentTarget);
            const $toggleContent = $target.next();
    
            $target.toggleClass('is-active');
    
            if ($target.hasClass('is-active')) {
                $toggleContent.slideDown(400);  
            }
            else {
                $toggleContent.slideUp(400);
            }
        });
    }

    initFaqs() {
        const qaData = JSON.parse(document.getElementById('qa-data').textContent);
        if (!qaData) return;
        
        const headings = qaData.map(group => group[0].heading);
        const descriptions = qaData.map(group => group[0].description);
        const blockContents = qaData.map(group => group.slice(1));

        console.log("descriptions", descriptions);
        

        headings.forEach((heading, index) => {
            const faqsBlock = document.createElement('div');
            faqsBlock.classList.add('faqs-block', 'mb-6', 'md:mb-10');
            faqsBlock.id = `tabID-${heading.replace(/\s+/g, '-')}`;
            faqsBlock.innerHTML = `
                ${heading !== "" ? `
                    <div class="faqs-block-title">
                        <h2 class="font-eina02"> ${heading}</h2>
                    </div>
                ` : ''}
                ${descriptions[index] !== "" ? `
                    <div class="faqs-block-description">
                        <p class="text-[#4B5154] body-font mb-2 md:mb-12 text-[14px] font-normal leading-[150%] md:text-[18px] md:tracking-[-0.18px]">${descriptions[index]}</p>
                    </div>
                ` : ''}
                ${blockContents[index].length > 0 ? `
                <div class="faqs-block-content" id="blockContent-${index}">
                    ${blockContents[index].map(item => `
                        <div class="faqAccordion">
                            <div class="faqAccordion__title">
                                <h3 class="body-font">${item.question}</h3>
                            </div>
                            <div class="faqAccordion__content">
                                ${item.answer}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            `;

            document.querySelector(".loadingOverlay__content").style.display = 'none';
            document.querySelector('.faqs-content').appendChild(faqsBlock);

            const tabsList = document.querySelector('.faqs-tab .tabs');

            if (tabsList) {
                tabsList.innerHTML += `
                    <li class="tab ${index === 0 ? 'is-active' : ''}">
                        <a class="tab-title" href="#tabID-${heading.replace(/\s+/g, '-')}">${heading}</a>
                    </li>`;
            }
        });
        this.toggleContent();
    }

    postTableContents() {
        const tableOfContents = document.querySelector('.tableOfContent__list');
        const contentTitles = document.querySelectorAll('.postDetails .post-title');
        if (!tableOfContents || !contentTitles) return;

        contentTitles.forEach(title => {
            let titleText = title.textContent.trim();
            const listItem = tableOfContents.querySelector(`li[data-title="${titleText}"]`);

            if (titleText === 'FAQs') {
                titleText = 'Frequently Asked Questions (FAQ)';
            }

            // Add ID to the post title for targeting
            const titleId = titleText.replace(/\s+/g, '-').toLowerCase();
            title.id = titleId;

            const tableItem = `
                <li class="tableOfContent__item">
                    <a href="#${titleId}" class="table-of-content-link">${titleText}</a>
                </li>
            `;

            // remove all li with class skeletor-loading
            tableOfContents.querySelectorAll('.skeletor-loading').forEach(item => {
                item.remove();
            });

            tableOfContents.innerHTML += tableItem;
        });

        // Add click event listeners for smooth scrolling
        this.addTableOfContentsScroll();
    }

    addTableOfContentsScroll() {
        const tableOfContentsLinks = document.querySelectorAll('.table-of-content-link');
        
        tableOfContentsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                tableOfContentsLinks.forEach(l => l.parentElement.classList.remove('is-active'));
                
                // Add active class to clicked link
                link.parentElement.classList.add('is-active');
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            });
        });

        // Initialize scroll spy
        this.initScrollSpy();
    }

    initScrollSpy() {
        const tableOfContentsLinks = document.querySelectorAll('.table-of-content-link');
        const postTitles = document.querySelectorAll('.postDetails .post-title');
        
        if (!tableOfContentsLinks.length || !postTitles.length) return;

        // Set initial active state
        this.updateActiveLink();

        // Add scroll event listener
        window.addEventListener('scroll', () => {
            this.updateActiveLink();
        });
    }

    updateActiveLink() {
        const tableOfContentsLinks = document.querySelectorAll('.table-of-content-link');
        const postTitles = document.querySelectorAll('.postDetails .post-title');
        
        if (!tableOfContentsLinks.length || !postTitles.length) return;

        const scrollPosition = window.scrollY ; // Offset for better detection
        let activeLink = null;

        // Find which post title is currently at the top
        for (let i = postTitles.length - 1; i >= 0; i--) {
            const title = postTitles[i];
            const titleTop = title.offsetTop;
            
            if (scrollPosition >= titleTop) {
                // Find corresponding link
                const titleId = title.id;
                activeLink = document.querySelector(`.table-of-content-link[href="#${titleId}"]`);
                break;
            }
        }

        // Update active states
        tableOfContentsLinks.forEach(link => {
            link.parentElement.classList.remove('is-active');
        });

        if (activeLink) {
            activeLink.parentElement.classList.add('is-active');
        }
    }
}
