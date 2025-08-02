import PageManager from './page-manager';

export default class Page extends PageManager {
    constructor(context) {
        super(context);
        this.context = context;
    }
    onReady() {
        function initTimelineScrollAnimation() {
            const timelineSection = document.getElementById('timeline-section');
            const timelineProgress = document.getElementById('timeline-progress');
            if (!timelineSection || !timelineProgress) return;

            const fillProgress = timelineSection.querySelectorAll('.point-target');
            gsap.registerPlugin(ScrollTrigger);
            gsap.set(timelineProgress, { height: "0%" });
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: timelineSection,
                    start: window.innerWidth <= 768 ? "top -60%" : "top 10%",
                    end: "bottom 30%",       // End when timeline is 30% out of viewport  
                    pin: true,               // Pin the section
                    pinSpacing: true,        // Maintain spacing
                    scrub: 1,                // Smooth scrub animation (1 second lag)
                    anticipatePin: 1,        // Smooth pin transition
                    refreshPriority: -1,     // Lower priority for smooth performance
                    onUpdate: (self) => {
                        const milestones = [0,0.25, 0.50, 0.75, 1.0];
                        fillProgress.forEach((point, index) => {
                            // Each point activates at its corresponding milestone
                            let sibling = point.parentElement;
                            if (self.progress >= milestones[index]) {
                                point.style.backgroundColor = '#C51414'; // Red when activated
                                // query to sibling .timeline-point of point
                                sibling.classList.add('active');  
                            } else {
                                point.style.backgroundColor = '#E7E6E6'; // Gray when not activated
                                sibling.classList.remove('active');
                            }
                        });
                    }
                }
            });
            
            // Animate progress from 0% to 100%
            tl.to(timelineProgress, {
                height: "100%",
                duration: 1,
                ease: "none"  // Linear animation for smooth scrub
            });
            
            // Refresh ScrollTrigger on window resize
            window.addEventListener('resize', () => {
                ScrollTrigger.refresh();
            });
            
            console.log('GSAP Timeline ScrollTrigger initialized');
        }
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTimelineScrollAnimation);
        } else {
            initTimelineScrollAnimation();
        }
        // Refresh ScrollTrigger when page loads completely
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });

        this.handleFaqsTab();
    }

    handleFaqsTab() {
        function toggleContent() {
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

        function sectionScroll() {
            let scrollList = document.querySelectorAll(".faqs-tab .tab-title");
        
            for (let scrollItem of scrollList) {
                scrollItem.addEventListener("click", (e) => {
                    e.preventDefault();
                    let itemHref = scrollItem.getAttribute("href");
                    let parentElement = scrollItem.parentElement;

                    scrollList.forEach(item => {
                        item.parentElement.classList.remove("is-active");
                    });

                    parentElement.classList.add("is-active");

                    $('html, body').animate({
                        scrollTop: $(itemHref).offset().top - 200
                    }, 1000);
                })
            }
        }

        function initFaqs() {
            const qaData = JSON.parse(document.getElementById('qa-data').textContent);
            if (!qaData) return;
            
            const headings = qaData.map(group => group[0].heading);
            const blockContents = qaData.map(group => group.slice(1));

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
                        <p class="body-font">${descriptions[index]}</p>
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

                tabsList.innerHTML += `
                    <li class="tab ${index === 0 ? 'is-active' : ''}">
                        <a class="tab-title" href="#tabID-${heading.replace(/\s+/g, '-')}">${heading}</a>
                    </li>`;
            });
            toggleContent();
            sectionScroll();
        }
        
        initFaqs();
    }
}
