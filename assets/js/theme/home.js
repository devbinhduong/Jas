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
        const button = $('[data-reveal="popup-video"]').closest('button');
        let content = `<video class="popup-video w-full h-full" src="https://videos.pexels.com/video-files/3573394/3573394-uhd_2560_1440_30fps.mp4" controls></video>`
        button.on('click', () => {
            this.modal.open();
            setTimeout(() => {
                this.modal.updateContent(content);
                $('#modal').find('.loadingOverlay').hide();
            }, 500);
        });
    }
}