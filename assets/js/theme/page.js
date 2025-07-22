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
            const fillProgress = timelineSection.querySelectorAll('.point-target');
            if (!timelineSection || !timelineProgress) return;
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
    } 
}
