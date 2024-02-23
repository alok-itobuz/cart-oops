import { FeaturePages } from "./app.mjs";

class Cart extends FeaturePages {
  constructor() {
    super();
    this._setCurrentPage(this.page.CART);
    this._displayProducts();
    this._renderFooter();
  }

  _displayProducts() {
    this.cart[this.email].forEach(
      ({ count, product: { id, image, title, price } }) => {
        const card = this._createCard(id, image, title, price, title, count);
        this.cardContainer.appendChild(card);
      }
    );
  }

  _renderFooter() {
    const totalItems = document.querySelector(".total-items");
    const totalPrice = document.querySelector(".total-price");

    totalItems.textContent = `: ${this.cart[this.email].length}`;
    totalPrice.textContent = `: $${this.cart[this.email].reduce(
      (acc, { count, product: { price } }) => acc + price * count,
      0
    )}`;
  }
}

new Cart();
