<template>

<form v-if="success" class="flex flex-col space-y-4" @submit.prevent="submitotp" novalidate>
    <div class="log-area">
                        <h2>OTP Verification</h2>
                        
                                <div class=" p-2 text-center">
                                    <div v-if="success" class="alert alert-warning"> <span>{{ success }}</span></div>

                                    <div v-if="custsuccess" class="alert alert-success"> <span>{{ custsuccess }}</span></div>
                                    <div v-if="custerror" class="alert alert-danger"> <span>{{ custerror }}</span></div>
                                    <h6>Please enter the one time password <br> to verify your account</h6>
                                    <div id="otp" class="inputs d-flex flex-row justify-content-center mt-2"> 
                                        <input v-model="formotp.first" placeholder="*" class="m-2 text-center form-control rounded" type="text" id="first" maxlength="1" /> 
                                        <input v-model="formotp.second" placeholder="*" class="m-2 text-center form-control rounded" type="text" id="second" maxlength="1" /> 
                                        <input v-model="formotp.third" placeholder="*" class="m-2 text-center form-control rounded" type="text" id="third" maxlength="1" /> 
                                        <input v-model="formotp.fourth" placeholder="*" class="m-2 text-center form-control rounded" type="text" id="fourth" maxlength="1" /> 
                                    </div>
                                </div>
                            

                        <button type="submit" class="auth-btn w-100 mt-1">Validate</button>
                        <a href="#">Resend OTP</a>
                    </div>
</form>
<form v-else class="flex flex-col space-y-4" @submit.prevent="submit" novalidate>
    
    <div class="log-area">
                        <h2>Register</h2>
                        <div class="form-floating mb-5">
                            <select   class="form-select" id="usertype"
                            v-model="form.usertype"
                                >
                                <option value="0">--Select--</option>
                                <option value="student">Student</option>
                                <option value="gaurdian">Gaurdian</option>
                                <option value="teacher">Teacher</option>

                                </select>
                            <label class="lable-text" for="usertype">Who are you? *</label>
                            <span class="text-danger" v-if="errors?.usertype">{{ errors.usertype[0] }}</span>
                        </div>
                        <div class="form-floating mb-5">
                            <input type="text" class="form-control" id="name"
                                placeholder="Name *" v-model="form.name">
                            <label class="lable-text" for="name">Name*</label>
                            <span class="text-danger" v-if="errors?.name">{{ errors.name[0] }}</span>
                        </div>
                        <div class="form-floating mb-5">
                            <input type="text" class="form-control" id="mobile"
                                placeholder="Enter Your Mobile No. *" v-model="form.mobile">
                            <label class="lable-text" for="mobile">Mobile No. *</label>
                            <span class="text-danger" v-if="errors?.mobile">{{ errors.mobile[0] }}</span>
                        </div>
                        
                        <div class="form-floating relative mb-4">
                            <input type="password" class="form-control relative" id="password"
                                placeholder="Password *" v-model="form.password">
                            <label class="lable-text" for="password">Password *</label>
                            <span class="text-danger" v-if="errors?.password">{{ errors.password[0] }}</span>

                            <div class="password-key">
                                <i class="icon-eye"></i>
                            </div>
                        </div>

                        <div class="mb-20 rem-forgot-btn">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="1" id="terms" 
                                    checked v-model="form.terms">
                                <label class="form-check-label" for="terms">
                                    I agree
                                </label>
                                
                            </div> 
                            <span class="text-danger" v-if="errors?.terms">{{ errors.terms[0] }}</span>                            
                        </div>

                        <p class="auth-desc">Your personal data will be used to support your experience
                            throughout this
                            website, to manage access to your account, and for other purposes described in
                            our <a href="./privacy-policy" target="_blank">privacy policy</a></p>

                        <button type="submit" class="auth-btn w-100 mt-5">Register</button>

                        <p class="mt-3">Do you have an account? <a href="/login">Sign In</a></p>
 </div>
 </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
 
const errors = ref({})
const success = ref('')
const custsuccess = ref('')
const custerror = ref('')
const form = reactive({
    usertype:'',
    name: '',
    mobile: '',
    password:'',
    rememberMe:''
});
 
function submit() {
    axios.post('/RegisterPost', form)
        .then(response => success.value = response.data.message)
        .catch(error => {
            if (error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        })
}

const formotp = reactive({
    first:'',
    second: '',
    third: '',
    fourth:''
});
function submitotp() {
    axios.post('/RegisterPostOtp', formotp)
        .then(response=>{
            if(response.data.code===200){
            custsuccess.value = response.data.message
            custerror.value = false
            setInterval(window.location.href='/login',10000)
            }else{
            custsuccess.value = false
            custerror.value  = response.data.message
            }
          }
         )
        .catch(error => {
            if (error.response.status === 422) {
                custerror.value = error.response.data.message
            }
        })
}
</script>