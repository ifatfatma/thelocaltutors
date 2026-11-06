<template>
    <div class="log-area" v-if="success">
        <h3 class="text-center">Change Password</h3>
        <div class="alert alert-success text-center">{{ success }}</div>
        <div class="text-center"><a class="btn btn-dark" href="./dashboard">Back to Dashboard</a></div>
    </div>
    <form v-else class="flex flex-col space-y-4" @submit.prevent="submit" novalidate>
                    <div class="log-area">
                               <div class="form-floating mb-5" >
                                    <input type="password" class="form-control" id="current_password" v-model="form.current_password" placeholder="Enter current password">
                                    <label class="lable-text" for="current_password">Current Password*</label>
                                    <div class="password-key">
                                        <i class="icon-eye"></i>
                                    </div>
                                    <span class="text-danger" v-if="errors?.current_password">{{ errors.current_password[0] }}</span>

                                </div>

                                <div class="form-floating mb-5">
                                    <input type="password" class="form-control"  id="new_password" v-model="form.new_password" placeholder="Enter new password">
                                    <label class="lable-text" for="new_password">New Password*</label>
                                    <div class="password-key">
                                        <i class="icon-eye"></i>
                                    </div>
                                    <span class="text-danger" v-if="errors?.new_password">{{ errors.new_password[0] }}</span>

                                </div>

                                <div class="form-floating mb-5">
                                    <input type="password" class="form-control" id="confirm_password" v-model="form.confirm_password" placeholder="Enter Confirm New Password">
                                    <label class="lable-text" for="confirm_password">Confirm Password</label>
                                    <div class="password-key">
                                        <i class="icon-eye"></i>
                                    </div>
                                    <span class="text-danger" v-if="errors?.confirm_password">{{ errors.confirm_password[0] }}</span>

                                </div>

                                <button type="submit" class="auth-btn w-100">Change</button>
                    </div>
                </form>
</template>



<script setup>
import { reactive, ref } from 'vue';
  
const errors = ref({})
const success = ref('')
const form = reactive({
    current_password: '',
    new_password:'',
    confirm_password:''
});
 
function submit() {
    axios.post('/ChangePasswordPost', form)
        .then(response=>{
            success.value = response.data.message
        }
        )
        .catch(error => {
            if (error.response.status === 422) {
                errors.value = error.response.data.errors
            }
        })
}

</script>