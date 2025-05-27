let swiperMain, swiperThumb;

const initSwipers = () => {
  swiperThumb = new Swiper('.mySwiper', {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
  });

  swiperMain = new Swiper('.mySwiper2', {
    spaceBetween: 10,
    thumbs: {
      swiper: swiperThumb,
    },
  });

  document.querySelector('.mySwiper2').style.display = 'block';
  document.querySelector('.mySwiper').style.display = 'block';
};

window.addEventListener('load', initSwipers);

class VariantSelector extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange() {
    this.getSelectedOptions();
    this.getSelectedVariant();
    this.updateUrl();
    this.updateFormID();
    this.updateSubmitBtn();
    this.updatePrice();
    this.updateGallery();
  }

  getSelectedOptions() {
    this.options = [
      ...Array.from(this.querySelectorAll('.variant-input'))
        .filter((input) => input.checked)
        .map((input) => input.value),
      ...Array.from(this.querySelectorAll('select'), (select) => select.value),
    ];
  }

  getVariantJSON() {
    this.variandData =
      this.variandData ||
      JSON.parse(
        this.querySelector('script[type="application/json"]').textContent,
      );

    return this.variandData;
  }

  getSelectedVariant() {
    const selectedProductTitle = this.options.join(' / ');

    this.selectedVariant = this.getVariantJSON().find(
      (variant) => variant.title === selectedProductTitle,
    );

    return this.selectedVariant;
  }

  updateUrl() {
    window.history.replaceState(
      {},
      '',
      `${this.dataset.url}?variant=${this.selectedVariant.id}`,
    );
  }

  updateFormID() {
    const formInput = document.querySelector('#product-form input[name="id"]');
    formInput.value = this.selectedVariant.id;
  }

  updatePrice() {
    fetch(
      `${this.dataset.url}?variant=${this.selectedVariant.id}&section_id=${this.dataset.section}`,
    )
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;

        const html = new DOMParser().parseFromString(responseText, 'text/html');

        const oldPrice = document.getElementById(id);

        const newPrice = html.getElementById(id);

        if (oldPrice && newPrice) oldPrice.innerHTML = newPrice.innerHTML;
      });
  }

  updateSubmitBtn() {
    const submitBtn = document.querySelector('.form-submit-btn');

    if (this.selectedVariant.available === false) {
      submitBtn.setAttribute('disabled', true);
      submitBtn.textContent = 'Sold out';
    } else {
      submitBtn.removeAttribute('disabled');
      submitBtn.textContent = 'Add to cart';
    }
  }

  updateGallery() {
    const galleries = JSON.parse(
      document.getElementById('variant-galleries').textContent,
    );
    const currentGallery = galleries[this.selectedVariant.id];

    const mainWrapper = document.getElementById('main-swiper-wrapper');
    const thumbWrapper = document.querySelector('.mySwiper .swiper-wrapper');

    // Clear existing slides
    mainWrapper.innerHTML = '';
    thumbWrapper.innerHTML = '';

    if (currentGallery && currentGallery.length > 0) {
      currentGallery.forEach((media, index) => {
        mainWrapper.innerHTML += `
          <div class="swiper-slide">
            <img class="w-full h-full object-cover aspect-square" width="200" height="200" src='${media}' alt='' />
          </div>
        `;
        thumbWrapper.innerHTML += `
          <div class="swiper-slide">
            <img src='${media}' alt='' />
          </div>
        `;
      });
    }

    // Reinitialize Swiper
    this.reinitSwiper();
  }

  reinitSwiper() {
    if (swiperMain) swiperMain.destroy(true, true);
    if (swiperThumb) swiperThumb.destroy(true, true);
    initSwipers();
  }
}

customElements.define('variant-selector', VariantSelector);
