var app = new Vue({
  el: '#admin',
  data: {
    name: "",
    file: null,
    addItem: null,
    fileSelected: false,
    posts: [],
  },
  created() {
    console.log("created");
    this.getItems();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
      this.fileSelected = true;
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/posts', {
          name: this.name,
          path: r1.data.path
        });
        this.addItem = r2.data;
        this.fileSelected = false;
      }
      catch (error) {
        console.log(error);
      }
      this.getItems();
    },
    async getItems() {
      try {
        let response = await axios.get("/api/posts");
        this.posts = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async deleteItem(post) {
      try {
        let response = axios.delete("/api/posts/" + post._id);
        this.getItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async likeItem(post) {
      try {
        let response = await axios.put("/api/posts/" + post._id);
        this.getItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
  },
});