var app = new Vue({
  el: '#app',
  data: {
    cities: [],
    prefix: '',
    defenitions: [],
    word: '',
  },
  methods: {
    async cityREST() {
      console.log("In Fetch " + this.prefix);
      var url = "/cities?q=";
      if (this.prefix === "") {
        url += ".";
      }
      else {
        url += this.prefix;
      }
      console.log("URL " + url);
      
      fetch(url)
        .then((data) => {
          return (data.json());
        })
        .then((cityList) => {
          console.log("CityList");
          console.log(cityList);
          this.cities = [];
          for (let i = 0; i < cityList.length; i++) {
            console.log(cityList[i].city);
            this.cities.push({ name: cityList[i].city });
          };
          console.log("Got Citylist");
        });
    },
    async owlREST() {
      console.log("In Fetch " + this.word);
      var url = "/owl?q=" + this.word;
      console.log("URL " + url);
      
      fetch(url)
        .then((data) => {
          return (data.json());
        })
        .then((defenitionsList) => {
          console.log("FrogList");
          console.log(defenitionsList);
          this.defenitions = [];
          for (let i = 0; i < defenitionsList.length; i++) {
            console.log(defenitionsList[i].defenition);
            this.defenitions.push({
              defenition: defenitionsList[i].defenition,
              type: defenitionsList[i].type });
          };
          console.log("Got owl list");
        });
    },
  },
});
