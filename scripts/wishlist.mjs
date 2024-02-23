import { FeaturePages } from "./app.mjs";

class Wishlist extends FeaturePages {
  constructor() {
    super();
    this.currentPage = this.page.WISHLIST;
    this._displayProducts(this.wishlist);
  }
  _displayProducts() {
    this.wishlist[this.email].forEach(({ id, image, title, price }) => {
      const card = this._createCard(id, image, title, price, title, null, true);
      this.cardContainer.appendChild(card);
    });
  }
}

new Wishlist();
