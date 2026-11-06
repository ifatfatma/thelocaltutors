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
                                
                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="address" v-model="address"
                                        placeholder="address">
                                    <label class="lable-text" for="address">Address</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <select class="form-control" id="state" name="state" v-model="state" @change="getDistricts()">
                                        <option value="" selected disabled>Select state</option>
                                        <option v-for='data in states' :value='data.id'>{{ data.name }}</option>
                                    </select>
                                    <label class="lable-text" for="state">State</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6" >
                                    <select class="form-control" id="district"  name="district" v-model="district" @change="getCities()">
                                        <option value="" selected disabled>Select district</option>
                                        <option v-for='data in districts' :value='data.id'>{{ data.name }}</option>
                                    </select>
                                    <label class="lable-text" for="district">District</label>
                                </div>


                                <div class="form-floating mb-5 col-lg-6" >
                                    <select class="form-control" id="city"  name="city" v-model="city">
                                        <option value="" selected disabled>Select city</option>
                                        <option v-for='data in cities' :value='data.id'>{{ data.name }}</option>
                                    </select>
                                    <label class="lable-text" for="city">City</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="pincode" name="pincode" v-model="pincode"
                                        placeholder="pincode">
                                    <label class="lable-text" for="pincode">Pincode</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="latitude" name="latitude" v-model="latitude"
                                        placeholder="latitude">
                                    <label class="lable-text" for="latitude">Latitude</label>
                                </div>

                                <div class="form-floating mb-5 col-lg-6" >
                                    <input type="text" class="form-control" id="longitude" name="longitude" v-model="longitude"
                                        placeholder="longitude">
                                    <label class="lable-text" for="longitude">Longitude</label>
                                </div>
                                <div class="form-floating mb-5 col-lg-6" >
                                    <textarea class="form-control" placeholder="description" v-model="description"
                                        id="description" name="description"></textarea>
                                    <label class="lable-text" for="description">Description</label>
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
            address : this.users.address??'',    
            description:this.users.description??'',
            pincode:this.users.pincode??'',
            latitude:this.users.latitude??'',
            longitude:this.users.longitude??'',       
            state:this.users.state??0,
            states:[],
            district:0,
            districts:[],
            city:0,
            cities:[]
        }
       
    },
    methods:{
        
        getStates: function (){
            axios.get('/get-states')
                .then(function (response){
                    this.states = response.data;
                }.bind(this));
        },
        getDistricts: function (){
            axios.get('/get-districts', {
                params: {
                    state_id: this.state
                }
            })
                .then(function (response){ 
                    this.districts = response.data;
                }.bind(this))
        },
        getCities: function (){
            axios.get('/get-cities', {
                params: {
                    district_id: this.district
                }
            })
                .then(function (response){
                    this.cities = response.data;
                }.bind(this))
        }
    },
    created: function () {
        this.getStates()
    }
}
function submit() {
    axios.post('/EditProfilePost', form)
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