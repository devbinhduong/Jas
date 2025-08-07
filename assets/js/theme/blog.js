import PageManager from './page-manager';

export default class Blog extends PageManager {
    constructor(context) {
        super(context);
        this.context = context;
        this.checkJS_load = true;
    }

    onReady() {
        this.eventLoad();
        this.handlePostsTabs();
    }

    loadFunction() {
        if (this.checkJS_load) {
            this.checkJS_load = false;

        }
    }

    eventLoad() {
        $(document).on('keydown mousemove touchstart', (e) => {
            this.loadFunction();
        });
    }

    handlePostsTabs() {
        const tagsList = document.querySelector('[data-tags-list]')?.getAttribute('data-tags-list');
        const tags = tagsList.split(',');
        const tabsTitle = document.querySelector(".blogTabs__tabs ul");

        tags.forEach(tag => {
            const tab = document.createElement('li');
            const tagUrl = tag.toLowerCase().trim().replace(/ /g, '+');

            tab.classList.add('customTabs__item');
            tab.classList.add('flex');
            tab.classList.add('items-center');
            tab.classList.add('justify-center');
            tab.classList.add('px-3');
            tab.classList.add('py-[3px]');
            tab.classList.add('leading-[26px]');
            tab.classList.add('text-[#000000]');
            tab.classList.add('border');
            tab.classList.add('border-[#000000]');
            tab.classList.add('rounded-[4px]');

            if (tag === tags[0]) {
                tab.classList.add('is-active');
                renderPostsTabs(tab, tagUrl);
            }

            tab.innerHTML = `<a class="customTabs__link body-font text-[14px] font-medium capitalize" href="/blog/tag/${tagUrl}">
                <span class="whitespace-nowrap">${tag}</span>
            </a>`;

            tabsTitle.appendChild(tab);

            handleClickTab(tab);
        });

        function handleClickTab(tab) {
            tab.addEventListener('click', (e) => {
                e.preventDefault();

                const tabs = document.querySelectorAll('.customTabs__item');
                tabs.forEach(tab => {
                    tab.classList.remove('is-active');
                });

                tab.classList.add('is-active');
                renderPostsTabs(tab);
            });
        }
        async function renderPostsTabs(tab, tagUrlFirst) {
            const blogTabContent = document.querySelector('.blogTabs__content');
            const tabUrl = tab.querySelector('a')?.getAttribute('href') ? tab.querySelector('a')?.getAttribute('href') : `/blog/tag/${tagUrlFirst}`;

            if (!tagUrlFirst) {
                blogTabContent.innerHTML = '';
            }

            try {
                const response = await fetch(tabUrl);
                const data = await response.text();
        
                const tempElement = document.createElement('div');
                tempElement.innerHTML = data;
        
                const posts = tempElement.querySelectorAll('.blog');
                
                posts.forEach(post => {
                    post.classList.remove('hidden');
                    post.classList.remove('blog-post-special');

                    blogTabContent.appendChild(post);
                });

                blogTabContent.classList.remove('is-loading');
            } catch (error) {
                console.error(error);
            }
        }

    }
}
