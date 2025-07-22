export default class megaMenuFunction {
    constructor() {}

    menuItem(num) {
        return {
            setMegaMenu(param) {
                param = $.extend({
                    style: '',
                    dropAlign: 'fullWidth',
                    dropWidth: '493px',
                    cateColumns: 1,
                    disabled: false,
                    bottomCates: '',
                    products:'',
                    productId: '',
                    label: '',
                    labelType: '',
                    content: '',
                    contentLeft: '',
                    contentRight: '',
                    images:'',
                    imagesTop: '',
                    imagesCustom: '',
                    imagesLeft: '',
                    imagesRight: ''
                }, param);

                var $scope = $('.navPages-list-custom > li:nth-child('+num+')');

                if(!$scope.hasClass('navPages-item-toggle')){
                    if (param.disabled === false) {
                        const subMegaMenu = $scope.find('> .navPage-subMenu');

                        if(param.style === 'style custom' || param.style === 'style custom-2' || param.style === 'style custom-3') {
                            if(!$scope.hasClass('has-megamenu')){
                                $scope.addClass('has-megamenu style-custom fullWidth');

                                if(!subMegaMenu.find('.cateArea').length){
                                    subMegaMenu.find('.container > .navPage-subMenu-list').wrap('<div class="cateArea columns-'+param.cateColumns+'"></div>');
                                }
                                if (param.style === 'style custom-2') {
                                    subMegaMenu.find('.container').addClass('flex flex-col gap-4');
                                } else {
                                    
                                }
                                if(!subMegaMenu.find('.imageArea').length){
                                    const rightItemClass = param.style === 'style custom-2'
                                        ? 'megamenu-right-item flex gap-4'
                                        : 'megamenu-right-item flex w-full flex-col gap-4';

                                    subMegaMenu.find('.container').append(
                                        `<div class="imageArea"><div class="${rightItemClass}">${param.imagesRight}</div></div>`
                                    );
                                }
                                subMegaMenu.find('.imageArea')
                                    .addClass(param.imageAreaWidth ? `max-w-[${param.imageAreaWidth}]` : '');

                                subMegaMenu.find('.cateArea')
                                    .addClass(param.cateAreaWidth ? `max-w-[${param.cateAreaWidth}]` : '');

                                subMegaMenu.addClass('customScrollbar');
                            }
                        }

                    }
                }

                return this;
            }
        }
    }
}
