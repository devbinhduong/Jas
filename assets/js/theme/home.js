import PageManager from './page-manager';
import { defaultModal } from './global/modal';
export default class Home extends PageManager {
    constructor(context) {
        super(context);
        this.modal = defaultModal();
    }
    onReady() {
        this.loadPopupVideo();
    }
    loadPopupVideo() {
        const videoId = this.context.themeSettings.videoid;
        const button = $('[data-reveal="popup-video"]').closest('button');
        let content = `<iframe class="popup-video aspect-[16/9] md:w-auto w-[300px]" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        button.on('click', () => {
            this.modal.open();
            setTimeout(() => {
                this.modal.updateContent(content);
                $('#modal').find('.loadingOverlay').hide();
            }, 500);
        });
    }
}