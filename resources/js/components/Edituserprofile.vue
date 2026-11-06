<template>
    <form method="post"  id="contact-form-mejor" class="row">
        <div class="form-floating mb-5 col-lg-6" >
            <input type="text" class="form-control" id="name" v-model="name" placeholder="Name" >
            <label class="lable-text" for="name">Name</label>
        </div>

        <div class="form-floating mb-5 col-lg-6">
            <input type="email" class="form-control" id="email" v-model="email"
                placeholder="Email">
            <label class="lable-text" for="email">Email</label>
        </div>

        <div class="form-floating mb-5 col-lg-6">
            <input type="text" class="form-control" id="mobile" v-model="mobile"
                placeholder="Mobile">
            <label class="lable-text" for="mobile">Mobile No.</label>
        </div>
        <button type="submit" class="auth-btn w-100">Update</button>
    </form> 
</template>



<script>
import { reactive, ref } from 'vue'; 

export default {
    props: [
      'users'
    ],
    data(){
        return {
            name : this.users.name??'',
            email : this.users.email??'',
            mobile: this.users.mobile??'',
            
        }
    }
}
</script>