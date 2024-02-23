import { FeaturePages } from "./app.mjs";

class Home extends FeaturePages {
  constructor() {
    super();
    this.currentPage = this.page.HOME;
    this._displayProducts();
  }
  _displayProducts() {
    this.products.forEach(({ id, image, title, price }) => {
      const card = this._createCard(
        id,
        image,
        title,
        price,
        title,
        this.cart[this.email]?.find((c) => c.product.id === id)?.count ?? 0,
        this.wishlist[this.email]?.find((p) => p.id === id) ? true : false
      );
      this.cardContainer.appendChild(card);
    });
  }
}

new Home();
