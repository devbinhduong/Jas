import megaMenuFunction from './megaMenuFunction';
    window.megaMenuFunction = megaMenuFunction;

export default function (context) {
	var settings = context.themeSettings;

	if (settings.customMegamenuType == 'Editor') {
	    var megaMenuFunction = new window.megaMenuFunction();
	    const urlStoreHash = $('.custom-global-block').data('store-hash-image');

		var mega_menu_styleCustom_item1 = parseInt(settings.mega_menu_styleCustom_item1),
			mega_menu_styleCustom_item2 = parseInt(settings.mega_menu_styleCustom_item2),
			mega_menu_styleCustom_item3 = parseInt(settings.mega_menu_styleCustom_item3),
			mega_menu_styleCustom_item4 = parseInt(settings.mega_menu_styleCustom_item4);

	    function SetItemMegaMenu(){
			 $('.navPages-list-megamenu > li:not(.navPages-item-toggle)').mouseover(event => {
				var numberItem = $(event.currentTarget).index() + 1;
				if (!$(event.currentTarget).hasClass('has-megamenu')) {
					LoadMegaMenu(numberItem);
				}
			});
	    }
	        
	    function LoadMegaMenu(numberItem){
			let mega_menu_styleCustom_img_1 = '',
				mega_menu_styleCustom_img_2 = '',
				mega_menu_styleCustom_img_3 = '',
				mega_menu_styleCustom_img_4 = '';

			if (settings.mega_menu_styleCustom_img1 != '') {
				mega_menu_styleCustom_img_1 = `
					<a class="image hover-zoom" href="${settings.mega_menu_styleCustom_link1}" aria-label="${settings.mega_menu_styleCustom_img1}">
						<img src="${urlStoreHash}${settings.mega_menu_styleCustom_img1}" alt="${settings.mega_menu_styleCustom_img1}">
					</a>
				`
			}

			if (settings.mega_menu_styleCustom_img2 != '') {
				mega_menu_styleCustom_img_2 = `
					<a class="image hover-zoom basis-1/3" href="${settings.mega_menu_styleCustom_link2}" aria-label="${settings.mega_menu_styleCustom_img2}">
						<img class="w-full" src="https://cdn11.bigcommerce.com/s-gsjfadk9v2/images/stencil/original/image-manager/bannermega12.png?t=1747637412" alt="${settings.mega_menu_styleCustom_img2}">
					</a>
					<a class="image hover-zoom basis-1/3" href="${settings.mega_menu_styleCustom_link2}" aria-label="${settings.mega_menu_styleCustom_img2}">
						<img class="w-full" src="https://cdn11.bigcommerce.com/s-gsjfadk9v2/images/stencil/original/image-manager/bannermega11.png?t=1747637416" alt="${settings.mega_menu_styleCustom_img2}">
					</a>
					<a class="image hover-zoom basis-1/3" href="${settings.mega_menu_styleCustom_link2}" aria-label="${settings.mega_menu_styleCustom_img2}">
						<img class="w-full" src="https://cdn11.bigcommerce.com/s-gsjfadk9v2/images/stencil/original/image-manager/megamenu-3.jpg?t=1749105397" alt="${settings.mega_menu_styleCustom_img2}">
					</a>
				`
			}

			if (settings.mega_menu_styleCustom_img3 != '') {
				mega_menu_styleCustom_img_3 = `
					<div class="flex w-full gap-4"><a class="image hover-zoom" href="${settings.mega_menu_styleCustom_link3}" aria-label="${settings.mega_menu_styleCustom_img3}">
						<img src="${urlStoreHash}${settings.mega_menu_styleCustom_img3}" alt="${settings.mega_menu_styleCustom_img3}">
					</a>
					<a class="image hover-zoom" href="${settings.mega_menu_styleCustom_link3}" aria-label="${settings.mega_menu_styleCustom_img3}">
						<img src="https://cdn11.bigcommerce.com/s-gsjfadk9v2/images/stencil/original/image-manager/bannermega22.png?t=1747637427" alt="${settings.mega_menu_styleCustom_img3}">
					</a></div>
					<a class="image hover-zoom fullWidth" href="${settings.mega_menu_styleCustom_link3}" aria-label="${settings.mega_menu_styleCustom_img3}">
						<img class="w-full" src="https://cdn11.bigcommerce.com/s-gsjfadk9v2/images/stencil/original/image-manager/megamenu-3.jpg?t=1749105397" alt="${settings.mega_menu_styleCustom_img3}">
					</a>
				`
			}

			if (settings.mega_menu_styleCustom_img4 != '') {
				mega_menu_styleCustom_img_4 = `
					<a class="image hover-zoom" href="${settings.mega_menu_styleCustom_link4}" aria-label="${settings.mega_menu_styleCustom_img4}">
						<img src="${urlStoreHash}${settings.mega_menu_styleCustom_img4}" alt="${settings.mega_menu_styleCustom_img4}">
					</a>
				`
			}

	        if (mega_menu_styleCustom_item1 == numberItem) {
	            
	        } else if (mega_menu_styleCustom_item2 == numberItem) {
	            megaMenuFunction.menuItem(mega_menu_styleCustom_item2).setMegaMenu({
	                style: 'style custom-2',
	                imageAreaWidth: settings.mega_menu_styleCustom_item2_imgWidth,
	                cateAreaWidth: settings.mega_menu_styleCustom_item2_cateWidth,
	                cateColumns: settings.mega_menu_styleCustom_item2_col,
					imagesRight: `${mega_menu_styleCustom_img_2}`
	            });
	        } else if (mega_menu_styleCustom_item3 == numberItem) {
	            megaMenuFunction.menuItem(mega_menu_styleCustom_item3).setMegaMenu({
	                style: 'style custom-3',
	                imageAreaWidth: settings.mega_menu_styleCustom_item3_imgWidth,
	                cateAreaWidth: settings.mega_menu_styleCustom_item3_cateWidth,
	                cateColumns: settings.mega_menu_styleCustom_item3_col,
					imagesRight: `${mega_menu_styleCustom_img_3}`
	            });
	        } else if (mega_menu_styleCustom_item4 == numberItem) {
	           
			} else {
				
	        }
	    }

	    var setItemMegaMenu = SetItemMegaMenu();

	    window.onload = setItemMegaMenu;
	}
}
