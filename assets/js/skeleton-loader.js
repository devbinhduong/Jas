$(document).on('lazyloaded', function (e) {
    const imgEle = e.target;
    if (imgEle.complete && imgEle.naturalHeight !== 0) {
        $(imgEle).closest('.skeletor-loading').removeClass('skeletor-loading');
    }
});
