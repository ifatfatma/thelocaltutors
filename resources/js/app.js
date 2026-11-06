import './bootstrap';
import { createApp } from 'vue';

import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Changepass from './components/Changepass.vue';
import Editprofile from './components/Editprofile.vue';
import Edituserprofile from './components/Edituserprofile.vue';

import '@/front/css/bootstrap.min.css';
import '@/front/css/animate.css';
import '@/front/css/nice-select2.css';
import '@/front/css/icomoom.css';
import '@/front/css/owl.carousel.min.css';
import '@/front/css/swiper.min.css'; 
import '@/front/css/toastr.css';
import '@/front/scss/style.css'; 


createApp({})
  .component('user-register', Register)
  .component('user-login', Login)
  .component('change-pass', Changepass)
  .component('edit-profile', Editprofile)
  .component('edit-user-profile', Edituserprofile)
  .mount('#app') 