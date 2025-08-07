import utils from '@bigcommerce/stencil-utils';
import modalFactory, { ModalEvents } from '../global/modal';

export default function (context) {
    const modal = modalFactory('#modal')[0];
    const $header = $('header.header');

    // enter to click
    $(document).on('keydown', '.card', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            const $target = $(e.target);
            $target.trigger('click');
        }
    });

    $(document).on('click', '.custom-add-to-cart', (event) => {
        event.preventDefault();
        if (window.FormData === undefined) {
            return;
        }

        const $addToCartBtn = $(event.currentTarget);
       
        const waitMessage = $addToCartBtn.data('waitMessage');
        
        const originalBtnVal = $addToCartBtn.text();
        

        // $addToCartBtn.text(waitMessage);
        $addToCartBtn.prop('disabled', true);

        const productId = $(event.currentTarget).data('product-id');

        if (productId === 0) {
            return;
        }

        const formData = new FormData();
        formData.append('product_id', productId);

        /* Default Quantity When Addding */
        let parentAction = $(event.target).closest('.card-action-wrapper');
        let qty = $('.card-form-incrementTotal', parentAction).val() ? $('.card-form-incrementTotal', parentAction).val() : 1;

        $(event.target)
            .parents('form')
            .find('[name^="qty"]')
            .each((id, el) => {
                qty = parseInt($(el).val(), 10);
            });

        if (qty) {
            formData.append('qty[]', qty);
        }

        // Add item to cart
        utils.api.cart.itemAdd(formData, (err, response) => {
            const errorMessage = err || response.data.error;
            const options = {
                template: 'common/cart-preview'
            };
            const $cartDropdown2 = $('#custom-cart-sidebar .custom-sidebar-wrapper');
            const $cartLoading = $('<div class="loadingOverlay"></div>');
            const loadingClass = 'is-loading';
            const $body = $('body');
            const $cart2 = $('[data-cart-preview2]');
            const $cart = $('[data-cart-preview]');
            // $addToCartBtn.text(originalBtnVal);
            $addToCartBtn.prop('disabled', false);
            // trigger dropdown menu

            $body.addClass('added-product');
            setTimeout(() => {
                $body.removeClass('added-product');
            }, 5000);
                

            // Guard statement
            if (errorMessage) {
                // Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;

                alert(tmp.textContent || tmp.innerText);

                return;
            }
            if ($(window).width() > 1024) {
                if(!$header.hasClass('is-sticky')){
                  $header.addClass('is-sticky');
                } 
                 if ($cart) $cart.click();
            } else {
                $cart2.trigger('click');
            }
        });
    });
}
