var app = new Vue({
  el: '#app',
  data: {
    items: [],
    chosenItems: [],
    shoppingCart: [],
  },
  created() {
    this.getItems();
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        this.items = this.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      // Add/remove items from chosenItems when user checks/unchecks their respective box
      if (this.chosenItems.indexOf(item.name) === -1) {
        this.chosenItems.push(item.name);
        console.log(this.chosenItems);
      }
      else {
        this.chosenItems.splice(this.chosenItems.indexOf(item.name), 1);
        console.log(this.chosenItems);
      }
    },
    addToShoppingCart(item) {
      // Check if already purchsed before adding it to Shopping Cart
      for (let itemInCart of this.shoppingCart) {
        if (item.name === itemInCart.name) {
          return;
        }
      }
      this.shoppingCart.push(item);
    },
    purchaseItems() {
      for (let name of this.chosenItems) {
        for (let item of this.items) {
          if (item.name == name) {
            this.purchaseItem(item);
            this.addToShoppingCart(item);
            this.shoppingCart = this.shoppingCart.sort((a, b) => (a.name > b.name) ? 1 : -1)
          }
        }
      }
      this.getItems();
    },
    async purchaseItem(item) {
      try {
        let response = await axios.put("/api/items/" + item._id);
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
});