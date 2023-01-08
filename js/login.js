import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2';

// 使用者可以從登入頁面登入，並轉到後台商品頁面
// 1. 建立元件
// 2. 生成 vue 元件
// 3. 渲染至畫面上
const app = {
    data () {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            axios.post(`${url}/admin/signin`, this.user)
            .then(res => {
                const { token, expired, message} = res.data;
                // 加入 cookie
                document.cookie = `w3-token=${token}; expires=${expired}`;
                // 加入 header
                axios.defaults.headers.common['Authorization'] = token;
                alert(message);
                window.location = 'products.html';
            })
            .catch(err => {
                alert(err.data.message);
            });
        }
    }
}

createApp(app).mount('#app');