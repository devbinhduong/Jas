import utils from '@bigcommerce/stencil-utils';
import megaMenuEditor from './megaMenuEditor';
import { getCategory, getBrand } from './api/categoryApi';
import carousel from '../common/carousel';

export default function (context) {
    const themeSettings = context.themeSettings;
    var $header = $('header.header'),
        height_header = $header.outerHeight(),
        header_top_height = $('.header').outerHeight();
    /* Scroll position */
    var scroll_position = $(window).scrollTop();

    var check_JS_load = true;

    /* Contains all functions  that are needed to be executed after JS is loaded */
    function loadFunction() {
        if (check_JS_load) {
            check_JS_load = false;

            /* Add global function here */
            closeSidebar();
            clickOverlay();

            toogleFooterMobile();
            authSidebarMobile();
            searchMobileClick();
            searchFormMobile();

        }
    }

    function eventLoad() {

        $(document).ready(function () {
            sectionLoad();
        });

        ['keydown', 'mousemove', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                loadFunction();
            });
        });


        window.matchMedia('(min-width: 1024px)').addEventListener('change', () => {
            megaMenuEditor(context);
        });

        /* Load When Match Media Function For Tablet */
        window.matchMedia('(max-width: 1024px)').addEventListener('change', () => {
            openMenuMobileEffect();
        });


        window.matchMedia('(max-width: 550px)').addEventListener('change', () => {
            toogleFooterMobile();
        });
        $(window).on('scroll', throttle(function () {
            const tScroll = window.scrollY || window.pageYOffset;
            if (tScroll > 400) {
                headerSticky(tScroll);
            } else {
                // Optionally, remove sticky if scrolling back above 300
                if ($header.hasClass('is-sticky')) {
                    $header.removeClass('is-sticky');
                    $('.header-height').remove();
                    $header[0].style.transform = 'translateY(0px)';
                    $header[0].style.opacity = '1';
                }
            }
        }, 100)); // 100ms throttle, adjust as needed
        window.addEventListener('resize', (e) => {
            searchFormMobile();
        });
    }
    eventLoad();

    /* Hide all Sidebar */
    function hideAllSidebar() {
        const body = document.body;
        const removeClassArray = ['has-activeNavPages', 'openCartSidebar', 'openAuthSidebar'];
        const menuMobileIcon = document.querySelector('.sidebar-toggle');

        /* Hide menu sidebar */
        if (body.classList.contains('has-activeNavPages')) {
            menuMobileIcon.click();
        }

        removeClassArray.forEach((sidebarClass) => {
            if (body.classList.contains(sidebarClass)) {
                body.classList.remove(sidebarClass);
            }
        });
    }

    /* Close sidebar */
    function closeSidebar() {
        const closeButtons = document.querySelectorAll('.custom-sidebar-close');
        if (!closeButtons) return;

        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', (e) => {
                e.preventDefault();
                hideAllSidebar();
            });
        }
    }

    function clickOverlay() {
        const backgroundOverlay = document.querySelector('.background-overlay');
        if (!backgroundOverlay) return;

        backgroundOverlay.addEventListener('click', (e) => {
            hideAllSidebar();
        });
    }

    /* Custom Animate */
    function customAnimate(section) {
        if (section.matches('.animate-loaded')) return;

        section.classList.add('animate-loaded');

        section.classList.add('animated');
    }
    /* Custom Slick Slider */

    function sectionLoad() {
        const handler = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const sectionType = section.getAttribute('data-section-load');

                    switch (sectionType) {
                        case 'animation':
                            customAnimate(section);
                            break;

                        case 'slick-slider':
                            if (!section.classList.contains('slick-initialized')) {
                                carousel(context, section);
                            }
                            break;
                        case 'ajax':
                            const ajaxData = section.getAttribute("data-ajax-type");
                            const isAjaxLoaded = section.classList.contains("ajax-loaded");
                            if (isAjaxLoaded) return;
                            if (ajaxData == "cateSlider") {
                                const cateIDList = section.getAttribute("data-cateid-list");
                                const cateIdListArr = cateIDList.split(",");
                                const cateSliderPromises = [];
                                cateIdListArr.forEach((cateId) => {
                                    cateSliderPromises.push(handleCateSlider(cateId));
                                });
                                Promise.all(cateSliderPromises).then((data) => {
                                    const proListHTMLOpen = `
                                        <div class="image-banner-list mx-[-6px] gap-x-4 gap-y-6 w-auto" data-section-load="slider" 
                                        data-slick='{
                                            "infinite": false,
                                            "arrows": true,
                                            "dots": false,
                                            "mobileFirst": true,
                                            "slidesToShow": 3,
                                            "slidesToScroll": 3,
                                            "prevArrow": ".image-banner-slider .custom-slick-prev",
                                            "nextArrow": ".image-banner-slider .custom-slick-next",
                                            "responsive": [
                                               {
                                                    "breakpoint": 550,
                                                    "settings": {
                                                        "slidesToShow": 4,
                                                        "slidesToScroll": 4
                                                    }
                                                },
                                                 {
                                                    "breakpoint": 768,
                                                    "settings": {
                                                        "slidesToShow": 6,
                                                        "slidesToScroll": 6
                                                    }
                                                },
                                                {
                                                    "breakpoint": 1025,
                                                    "settings": {
                                                        "slidesToShow": 8,
                                                        "slidesToScroll": 4
                                                    }
                                                }
                                            ]
                                        }'>
                                    `;
                                    const proListHTMLClose = `</div>`;
                                    const proListHTML = proListHTMLOpen + data.join("") + proListHTMLClose;
                                    $(section).html(proListHTML);
                                    carousel(context, $(".image-banner-list", $(section)));
                                    $(section).addClass("ajax-loaded");
                                });
                                return;
                            }
                        case 'cateByTab':
                            handleCateByTab();
                            break;
                        default:
                            break;
                    }
                }
            });
        }

        const sections = document.querySelectorAll('[data-section-load]'),
            options = {
                threshold: .1
            };

        if (!sections) return;

        const observer = new IntersectionObserver(handler, options);

        sections.forEach(section => {
            observer.observe(section);
        });
    }
    function searchFormMobile() {
        const $iconMenu = $('[data-mobile-menu-toggle="menu"]'),
            $menuMobile = $('#custom-menu-mobile .custom-sidebar-wrapper'),
            $wrapperMenu = $('.header #menu .navPages .navPages-list-wrapper'),
            $menuDesktop = $('.header #menu .navPages-list-wrapper');

        if (window.innerWidth <= 1024) {
            if ($menuDesktop.length > 0) {
                $iconMenu.on('click', (e) => {
                    e.preventDefault();
                    $menuMobile.append($menuDesktop);
                });
            }
        } else {
            megaMenuEditor(context);
            if ($menuMobile.length > 0) {
                $wrapperMenu.append($menuMobile.find('.navPages-list-wrapper'));
            }
        }
    }
    function searchMobileClick() {
        const body = document.body,
            searchMobileButton = document.querySelector(
                "[data-search='quickSearch']"
            );

        if (!searchMobileButton) return;

        searchMobileButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchMobileButton.classList.contains('is-open')) {
                body.classList.remove('openSearchMobile');
                searchMobileButton.classList.remove('is-open');
            } else {
                body.classList.add('openSearchMobile');
                searchMobileButton.classList.add('is-open');
            }
        });
    }
    function authSidebarMobile() {
        const loginMobileButton = $(
            '.navUser-item--account'
        ),
            authSidebar = document.querySelector('.custom-auth-sidebar');

        if (!loginMobileButton || !authSidebar) return;

        loginMobileButton.on('click', (e) => {
            e.preventDefault();

            if (!document.body.classList.contains('page-type-login')) {
                if (authSidebar.classList.contains('is-open')) {
                    authSidebar.classList.remove('is-open');
                    document.body.classList.remove('openAuthSidebar');
                } else {
                    authSidebar.classList.add('is-open');
                    document.body.classList.add('openAuthSidebar');
                }
            } else {
                $('html, body').animate(
                    {
                        scrollTop: $('.login').offset().top,
                    },
                    700
                );
            }
        });
    }
    function findCategoryById(categories, cateId) {
        for (const item of categories) {
            if (item.entityId == cateId) {
                return item;
            }
            if (item.children && item.children.length > 0) {
                const found = findCategoryById(item.children, cateId);
                if (found) return found;
            }
        }
        return null;
    }
    function findBrandById(brands, brandId) {
        for (const item of brands) {
            if (item.node.entityId == brandId) {
                console.log('%cMyProject%cline:308%citem', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px', item)
                return item;
            }
        }
    }
    async function handleCateSlider(cateId) {
        const resCate = await fetchCategoryData(context, 'hasImage');
        const dataCate = findCategoryById(resCate, cateId);
        if (dataCate) {
            const cateItemHTML = `<div class="flex px-2">
                <div class="bg-[#EAECF0] rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 aspect-square p-[10px] md:p-3 flex flex-col items-center justify-center">
                    <div class="relative group hover-zoom">
                        <a href="${dataCate.path
                }" class="aspect-square rounded flex items-center justify-center group-hover:scale-105 transition-transform duration-300 w-full h-full custom-fadeZoom" data-step-animate="1">
                            ${dataCate.image
                    ? `<img class="object-contain w-full h-full lazyload"
                                    data-src="${dataCate.image.urlOriginal}" alt="${dataCate.image.altText}" title="${dataCate.image.altText}">`
                    : `<img class="object-contain w-full h-full lazyload" src="https://cdn11.bigcommerce.com/s-gsjfadk9v2/images/stencil/245x245/image-manager/logo-load-removebg-preview.png?t=1748590661" alt="Default Product Image">`
                }
                        </a>
                    </div>
                    </div>
                    <div class="text-center mt-4 custom-fadeInUp" data-step-animate="1">
                        <a href="${dataCate.path}"
                        class="text-center block text-gray-800 hover:text-blue-600 transition-colors duration-300 ">
                            <span class="cate-title text-sm">${dataCate.name}</span>
                        </a>
                    </div>
            </div>`;

            return cateItemHTML;
        }
    }
    function loadProduct(productBlock, $options, cateURL) {

        if (cateURL != undefined) {
            cateURL = cateURL.replace(/https?:\/\/[^/]+/, "");
            utils.api.getPage(cateURL, $options, (err, response) => {
                if (!$(response).find(".page-content--err").length) {
                    $(".tab-content-item", $(productBlock)).html(response);
                    carousel(context, $(".tab-content-item .productCarousel", $(productBlock)));
                    $(productBlock).closest('.tab-content').addClass("ajax-loaded");
                }
            });
        }
    }

    function openMenuMobileEffect() {
        if (window.innerWidth > 1024) return;

        const body = document.body,
            menuMobileIcon = document.querySelector('.mobileMenu-toggle'),
            topPromotion = document.querySelector('#bspoq_topPromotion');

        if (!menuMobileIcon || !topPromotion || topPromotion.classList.contains("u-hidden")) return;

        menuMobileIcon.addEventListener('click', (event) => {
            event.preventDefault();

            if (!body.classList.contains('has-activeNavPages')) {
                $('header.header').removeClass('slide-up');
            } else {
                $('header.header').addClass('slide-up');
            }
        });
    }
    function headerSticky(tScroll) {
        if (!themeSettings.show_sticky_header) return;

        const isSticky = $header.hasClass('is-sticky');
        const shouldSticky = tScroll > header_top_height && tScroll < scroll_position;

        if (shouldSticky && !isSticky) {
            if (!$('.header-height').length) {
                $header.before(
                    '<div class="header-height" style="height: ' + height_header + 'px"></div>'
                );
            }
            $header.addClass('is-sticky');
            animateHeaderIn($header[0]);
        } else if (!shouldSticky && isSticky) {
            animateHeaderOut($header[0], function () {
                $header.removeClass('is-sticky');
                $('.header-height').remove();
                $header[0].style.transform = 'translateY(0px)';
                $header[0].style.opacity = '1';
            });
        }
        scroll_position = tScroll;
    }
    function animateHeaderIn(element) {
        element.style.transition = 'none';
        element.style.opacity = '0';
        // Force reflow
        void element.offsetWidth;
        element.style.transition = 'transform 0.3s cubic-bezier(0.23,1,0.32,1), opacity 0.3s cubic-bezier(0.23,1,0.32,1)';
        element.style.transform = 'translateY(0px)';
        element.style.opacity = '1';
    }
    function animateHeaderOut(element, onComplete) {
        element.style.transition = 'transform 0.3s cubic-bezier(0.55,0.06,0.68,0.19), opacity 0.3s cubic-bezier(0.55,0.06,0.68,0.19)';
        element.style.opacity = '0';
        element.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'opacity') {
                element.removeEventListener('transitionend', handler);
                if (typeof onComplete === 'function') onComplete();
            }
        });
    }
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    /* Footer Mobile Toggle */
    function toogleFooterMobile() {
        if (window.innerWidth > 550) return;

        const $footerHeadingToggle = $('.footer-info-heading--toggle');

        $footerHeadingToggle.on('click', (e) => {
            e.preventDefault();

            const $target = $(e.currentTarget);
            const $thisFooterInfo = $target.parents('.footer-info-col');
            const $thisFooterInfo_list = $thisFooterInfo.find('.footer-info-list');

            $thisFooterInfo.toggleClass('open-dropdown');

            if ($thisFooterInfo.hasClass('open-dropdown')) {
                $thisFooterInfo_list.slideDown(400);
            }
            else {
                $thisFooterInfo_list.slideUp(400);
            }
        });
    }
    /* Get Scrollbar width */
    function handleCateByTab() {
        const tabItems = document.querySelectorAll(".tab-item");
        const listTitleTab = document.querySelectorAll(".lists-title-tab li");
        // Load all tab contents first
        const loadAllTabs = async () => {
            const options = {
                config: {
                    category: {
                        products: { limit: 10 }
                    }
                },
                template: "jas/custom/product-block"
            };

            // Load content for each tab
            for (const item of listTitleTab) {
                const titleId = item.getAttribute("data-title-id");
                const targetUrl = item.getAttribute("data-url");
                const targetTab = document.querySelector(`#tab-${titleId}`);

                if (targetTab && !targetTab.classList.contains('ajax-loaded')) {
                    await new Promise((resolve) => {
                        loadProduct(targetTab, options, targetUrl);
                        resolve();
                    });
                }
            }

            // Show first tab by default
            if (tabItems.length > 0) {
                const firstTab = tabItems[0];
                const firstTabId = firstTab.getAttribute("data-title-id");
                const firstTabContent = document.querySelector(`#tab-${firstTabId}`);
                firstTab.classList.add('is-active');
                firstTabContent.classList.add('is-active');
            }
        };

        // Load category names and URLs
        const loadCategoryNames = async () => {
            // const dataCate = await fetchCategoryData(context);
            const dataBrand = await fetchBrandData(context);
            for (const item of listTitleTab) {
                const titleId = item.getAttribute("data-title-id");
                // const cateId = findCategoryById(dataCate, titleId);
                const brandId = findBrandById(dataBrand, titleId);
                console.log('%cMyProject%cline:500%cbrandId', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px', brandId)
                // if (cateId) {
                //     item.innerHTML = `<span>${cateId.name}</span>`;
                //     item.setAttribute('data-url', cateId.path);
                // }
                if (brandId) {
                    item.innerHTML = `<span>${brandId.node.name}</span>`;
                    item.setAttribute('data-url', brandId.node.path);
                }
            }
        };

        // Initialize tabs
        const initTabs = () => {
            tabItems.forEach((item) => {
                item.addEventListener("click", (e) => {
                    e.preventDefault();
                    const target = e.currentTarget;
                    const targetId = target.getAttribute("data-title-id");
                    const targetTab = document.querySelector(`#tab-${targetId}`);

                    // Remove active class from all tabs and contents
                    document.querySelectorAll('.is-active').forEach(el => {
                        el.classList.remove('is-active');
                    });

                    // Add active class to clicked tab and its content
                    targetTab.classList.add('is-active');
                    item.classList.add('is-active');

                    // GSAP animation: fade in the tab content
                    animateTabIn(targetTab);

                    $(targetTab).find('.productCarousel').slick('refresh');
                });
            });
        };

        // Execute initialization
        loadCategoryNames().then(() => {
            loadAllTabs();
            initTabs();
        });
    }
    function animateTabIn(element) {
        element.style.transition = 'none';
        element.style.transform = 'translateY(30px)';
        element.style.opacity = '0';
        void element.offsetWidth;
        element.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), opacity 0.5s cubic-bezier(0.23,1,0.32,1)';
        element.style.transform = 'translateY(0px)';
        element.style.opacity = '1';
    }
    const fetchCategoryData = async (context, param) => {
        const resCate = await getCategory(context, param);
        return resCate.data.site.categoryTree;
    };
    const fetchBrandData = async (context) => {
        const resBrand = await getBrand(context);
        console.log('%cMyProject%cline:558%cresBrand', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px', resBrand)
        return resBrand.data.site.brands.edges;
    }
    function closePromotionBanner() {
        const closePromotionBanner = document.querySelector('#close-promotion-banner');
        if (!closePromotionBanner) return;

        closePromotionBanner.addEventListener('click', (e) => {
            e.preventDefault();
            const promotionBanner = document.querySelector('#promotion-banner');
            if (promotionBanner) {
                promotionBanner.style.display = 'none';
            }
        });
    }
    closePromotionBanner();
}
