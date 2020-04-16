var app = new Vue({
    el: '#app',
    data: {
        title: '',
        firstName: '',
        lastName: '',
        books: [],
        authors: [],
        book: '',

    },
    methods: {
        getAuthors() {
            console.log("In Author " + this.firstName);
            var url = "/api/author?";
            if (this.firstName !== "") {
                url += "firstName=" + this.firstName
            }
            if (this.lastName !== "" && this.firstName !== "") {
                url += "&";
            }
            if (this.lastName !== "") {
                url += "lastName=" + this.lastName;
            }

            console.log("URL " + url);
            fetch(url)
                .then((data) => {
                    return (data.json());
                })
                .then((authorlist) => {
                    console.log("authorList");
                    // this.authors = authorlist;
                    var semiauthors = authorlist;
                    // for (let i = 0; i < this.authors.author.length; i++) {
                    for (let i = 0; i < semiauthors.author.length; i++) {
                        // let author = this.authors.author[i]
                        let author = semiauthors.author[i]
                        author.books = []
                        if (author.titles === null) {
                            console.log("Author " + author.authordisplay + " titles is null.")
                        }
                        else {
                            for (let j = 0; j < author.titles.isbn.length; j++) {
                                let url = "/api/title?isbn=" + author.titles.isbn[j].$;
                                fetch(url)
                                    .then((data) => {
                                        return (data.json());
                                    })
                                    .then((bookdata) => {
                                        author.books.push(bookdata);
                                    });
                            }
                        }
                    }
                    this.authors = semiauthors;
                });

        },
        
    }
});
