import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import { showAlertModal } from '@bigcommerce/stencil-utils';
export const CartPreviewEvents = {
    close: 'closed.fndtn.dropdown',
    open: 'opened.fndtn.dropdown',
};

export default function (secureBaseUrl, cartId) {
    const loadingClass = 'is-loading';
    const $cart = $('[data-cart-preview]');
    const isDesktopDropdown = window.matchMedia('(min-width: 1024px)').matches;
    const $cartDropdown = isDesktopDropdown ? $('.headerMid__right--desktop #cart-preview-dropdown') : $('.headerMid__right--mobile #cart-preview-dropdown');
    const $cartLoading = $('<div class="loadingOverlay"></div>');
    const $cart2 = $('[data-cart-preview2]');
    const $body = $('body');
    const $cartDropdown2 = $('#custom-cart-sidebar .custom-sidebar-wrapper');
    if (window.ApplePaySession) {
        $cartDropdown.addClass('apple-pay-supported');
    }

    $body.on('cart-quantity-update', (event, quantity) => {
        $cart.attr('aria-label', (_, prevValue) => prevValue.replace(/\d+/, quantity));

        if (!quantity) {
            $cart.addClass('navUser-item--cart__hidden-s');
        } else {
            $cart.removeClass('navUser-item--cart__hidden-s');
        }

        $('.cart-quantity')
            .text(quantity)
            .toggleClass('countPill--positive', quantity > 0);
        if (utils.tools.storage.localStorageAvailable()) {
            localStorage.setItem('cart-quantity', quantity);
        }
    });
    
    $cart.on('click', event => {
        const options = {
            template: 'common/cart-preview',
        };

        // Redirect to full cart page
        //
        // https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
        // In summary, we recommend looking for the string 'Mobi' anywhere in the User Agent to detect a mobile device.
        if (/Mobi/i.test(navigator.userAgent)) {
            return event.stopPropagation();
        }

        event.preventDefault();
        $body.toggleClass('openCartDropdown');
        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading);
        $cartLoading
            .show();

        utils.api.cart.getContent(options, (err, response) => {
            $cartDropdown
                .removeClass(loadingClass)
                .html(response);
            $cartLoading
                .hide();
            updateCartQuantity();
        });
    });
    $cart2.on('click', event => {
        const options = {
            template: 'common/cart-preview',
        };
        event.preventDefault();

        $body.toggleClass('openCartSidebar');

        $cartDropdown.empty();

        $cartDropdown2
            .addClass(loadingClass)
            .html($cartLoading);
        $cartLoading
            .show();

        utils.api.cart.getContent(options, (err, response) => {
            $cartDropdown2
                .removeClass(loadingClass)
                .html(response);
            $cartLoading
                .hide();
            updateCartQuantity();
        });
    });
    function enterToClick() {
        const $button = document.querySelectorAll('[data-enter-to-click]');

        if (!$button) return;

        for (let i = 0; i < $button.length; i++) {
            $button[i].addEventListener('keydown', function (event) {
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (event.key === 'Enter' || event.which === 13) {
                    event.target.click();
                }
            });
        }
    }
    function updateCartQuantity() {
        $('[data-cart-update]').on('click', event => {
            const $target = $(event.currentTarget);

            event.preventDefault();
            listenQuantity($target);

            // update cart quantity
        });
    }
    let quantity = 0;

    if (cartId) {
        // Get existing quantity from localStorage if found
        if (utils.tools.storage.localStorageAvailable()) {
            if (localStorage.getItem('cart-quantity')) {
                quantity = Number(localStorage.getItem('cart-quantity'));
                $body.trigger('cart-quantity-update', quantity);
            }
        }

        // Get updated cart quantity from the Cart API
        const cartQtyPromise = new Promise((resolve, reject) => {
            utils.api.cart.getCartQuantity({ baseUrl: secureBaseUrl, cartId }, (err, qty) => {
                if (err) {
                    // If this appears to be a 404 for the cart ID, set cart quantity to 0
                    if (err === 'Not Found') {
                        resolve(0);
                    } else {
                        reject(err);
                    }
                }
                resolve(qty);
            });
        });

        // If the Cart API gives us a different quantity number, update it
        cartQtyPromise.then(qty => {
            quantity = qty;
            $body.trigger('cart-quantity-update', quantity);
        });
    } else {
        $body.trigger('cart-quantity-update', quantity);
    }
    $(document).on('click', event => {
        if (($(event.target).closest('[data-cart-preview]').length === 0) && ($(event.target).closest('#cart-preview-dropdown').length === 0) && ($(event.target).closest('#modal').length === 0) && ($(event.target).closest('[data-search="quickSearch"]').length === 0)) {
            $('body').removeClass('openCartDropdown');
            $('body').removeClass('openSearchMobile');
        }
    });
    $(document).on('click', '.previewCart .previewCartItem-remove', (event) => {
        event.preventDefault();
        const itemId = $(event.currentTarget).data('cartItemid');

        cartRemoveItem(itemId);
    });
    $(document).on('keydown', '.previewCart .previewCartItem-remove', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const $target = $(e.target);

            $target.trigger('click');
        }
    });
    $(document).on('focus', '.previewCart .form-input--incrementTotal', (event) => {
        const $target = $(event.currentTarget);
        $target.data('preVal', $target.val());
    });

    $(document).on('change', '.previewCart .form-input--incrementTotal', (event) => {
        const $target = $(event.currentTarget);
        var preVal = $target.data('preVal');
        event.preventDefault();

        cartUpdateQtyTextChange($target, preVal);
    });

    function cartRemoveItem(itemId) {
        utils.api.cart.itemRemove(itemId, (err, response) => {
            if (response.data.status === 'succeed') {
                refreshContent(true);
                setTimeout(() => {
                    document.querySelector(".custom-cart [data-cart-preview]").focus();
                }, 1000);
            } else {
                alert(response.data.errors.join('\n'));
            }
        });
    }


    function cartUpdateQtyTextChange($target, preVal = null) {
        const itemId = $target.data('cart-itemid');
        const $el = $(`#qty-${itemId}`);
        const maxQty = parseInt($el.data('quantityMax'), 10);
        const minQty = parseInt($el.data('quantityMin'), 10);
        const oldQty = preVal !== null ? preVal : minQty;
        const minError = $el.data('quantityMinError');
        const maxError = $el.data('quantityMaxError');
        const newQty = parseInt(Number($el.val()), 10);
        let invalidEntry;

        // Does not quality for min/max quantity
        if (!newQty) {
            invalidEntry = $el.val();
            $el.val(oldQty);
            return swal.fire({
                text: `${invalidEntry} is not a valid entry`,
                icon: 'error',
            });
        } else if (newQty < minQty) {
            $el.val(oldQty);
            return swal.fire({
                text: minError,
                icon: 'error',
            });
        } else if (maxQty > 0 && newQty > maxQty) {
            $el.val(oldQty);
            return swal.fire({
                text: maxError,
                icon: 'error',
            });
        }

        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            if (response.data.status === 'succeed') {
                // if the quantity is changed "1" from "0", we have to remove the row.
                const remove = (newQty === 0);
                refreshContent(remove);
            } else {
                $el.val(oldQty);
                swal.fire({
                    text: response.data.errors.join('\n'),
                    icon: 'error',
                });
            }
        });
    }

    function refreshContent(remove) {
        const options = {
            template: 'common/cart-preview',
        };

        if ($body.hasClass('openCartDropdown')) {
            $cartDropdown
                .addClass(loadingClass)
                .prepend($cartLoading);
            $cartLoading
                .show();

            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown
                    .removeClass(loadingClass)
                    .html(response);
                $cartLoading
                    .hide();

                const quantity = $(response).find('[data-cart-quantity]').data('cartQuantity') || $('[data-cart-quantity]').data('cartQuantity') || 0;

                $body.trigger('cart-quantity-update', quantity);
                updateCartQuantity();
            });
        } else if ($body.hasClass('openCartSidebar')) {
            $cartDropdown2
                .addClass(loadingClass)
                .html($cartLoading);
            $cartLoading
                .show();

            utils.api.cart.getContent(options, (err, response) => {
                $cartDropdown2
                    .removeClass(loadingClass)
                    .html(response);
                $cartLoading
                    .hide();
                updateCartQuantity();
                const quantity = $(response).find('[data-cart-quantity]').data('cartQuantity') || $('[data-cart-quantity]').data('cartQuantity') || 0;

                $body.trigger('cart-quantity-update', quantity);
            });
        }

        if (location.pathname == "/cart.php") {
            cart_page.refreshContent(remove);
        }
    }

    function listenQuantity($target) {
        let $cartItem = $target.closest('.previewCartItem');
        let input = $cartItem.find('.form-input--incrementTotal');
        let min = parseInt(input.data('quantityMin'), 10) || 1;
        let value = parseInt(input.val(), 10);
        let itemId = $cartItem.data('cartItemid');
        
        let newQty = value;
        if ($target.data('action') === 'inc') {
            newQty = value + 1;
        } else if ($target.data('action') === 'dec') {
            newQty = value > min ? value - 1 : min;
        }

        if (newQty === value) return;
        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            // Check if response and response.data exist before accessing properties
            if (response && response.data && response.data.status === 'succeed') {
                // if the quantity is changed "1" from "0", we have to remove the row.
                const remove = (newQty === 0);
                refreshContent(remove);
            } else {
                input.val(value);
                // Handle cases where response or response.data is missing, or status is not 'succeed'
                const errorMessage = (response && response.data && response.data.errors) ? response.data.errors.join('\n') : 'An unknown error occurred.';
                swal.fire({
                    text: errorMessage,
                    icon: 'error',
                });
            }
        });
    }
}
