<template>
    <div class="log-area" v-if="success"><div class="alert alert-success">{{ success }}</div></div>
    <form v-else class="flex flex-col space-y-4" @submit.prevent="submit" novalidate>
    <div class="log-area">
                        <h2>Login</h2>
                        <div class="form-floating mb-5">
                            <input type="number" class="form-control" id="user_mobile"
                                placeholder="Mobile Number *" v-model="form.user_mobile">
                            <label class="lable-text" for="user_mobile">Mobile Number*</label>
                            <span class="text-danger" v-if="errors?.user_mobile">{{ errors.user_mobile[0] }}</span>
                        </div>
                        <div class="form-floating relative mb-4">
                            <input type="password" class="form-control relative" id="user_password"
                                placeholder="Password *" v-model="form.user_password">
                            <label class="lable-text" for="user_password">Password *</label>
                            <span class="text-danger" v-if="errors?.user_password">{{ errors.user_password[0] }}</span>

                            <div class="password-key">
                                <i class="icon-eye"></i>
                            </div>
                        </div>

                        <div class="rem-forgot-btn">
                            <div class="form-check">
                                <input class="form-check-input" v-model="form.rememberme" type="checkbox" value="1" id="rememberme"
                                    checked>
                                <label class="form-check-label" for="rememberme">
                                    Remember me
                                </label>
                            </div>

                            <div class="forgot-pass">
                                <a href="./forgot">Lost your password?</a>
                            </div>
                        </div>

                        <button type="submit" class="auth-btn w-100 mt-5">Login</button>

                        <p class="mt-3 text-center">Create new account <a href="./register">Click here</a></p>
                        <div v-if="errorsbox" class="alert alert-danger">{{ errorsbox }}</div>
                    </div>
                    
            </form>
</template>
<script setup>
import { reactive, ref } from 'vue';
 
const errors = ref({})
const success = ref('')
const errorsbox = ref('')
const form = reactive({
    user_mobile: '',
    user_password:'',
    rememberme:''
});
 
function submit() {
    axios.post('/LoginPost', form)
        .then(response=>{
            success.value = response.data.message
            setInterval(window.location.href='/dashboard',10000)
        }
        )
        .catch(error => { 
            if (error.response.status === 422) {
                errors.value = error.response.data.errors
            }else if (error.response.status === 400) {
                errorsbox.value = error.response.data.message
            }
        })
}

</script>