import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";

let url = "https://vue3-course-api.hexschool.io/v2/";

const App = {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      axios
        .post(`${url}admin/Signin`, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `loginToken=${token}; expires=${new Date(
            expired
          )}; path=/`;
          window.location = "products.html";
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {},
};

createApp(App).mount("#app");
