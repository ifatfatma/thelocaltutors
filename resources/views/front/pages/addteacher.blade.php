@extends('front.layouts.layouts')

@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(img/bg-img/home-3/bg.png);">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="{{url('index')}}">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Teacher</li>
                        </ul>
                        <h4 class="mb-0">Teacher Panel</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <!-- teacher area -->
    
    <div class="log-regi-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <div class="log-area">
                            <h3>Update your information!</h3>
                            
                            <form method="post"  id="contact-form-mejor">
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="name" placeholder="Name">
                                    <label class="lable-text" for="name">Name</label>
                                </div>

                                <div class="form-floating mb-5"class="col-lg-6">
                                    <input type="email" class="form-control" id="email"
                                        placeholder="Email">
                                    <label class="lable-text" for="email">Email</label>
                                </div>

                                <div class="form-floating mb-5"class="col-lg-6">
                                    <input type="text" class="form-control" id="contact"
                                        placeholder="contact">
                                    <label class="lable-text" for="contact">Contact</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <textarea class="form-control" placeholder="description"
                                        id="description"></textarea>
                                    <label class="lable-text" for="description">Description</label>
                                </div>

                                <div class="form-floating mb-5">
                                    <select type="text" class="form-select" id="floatingInput6">
                                        <option value="0">Gender</option>
                                        <option value="1">Male</option>
                                        <option value="2">Female</option>                                               <option value="2">Female</option>        
                                        <option value="2">Both</option>        
                                        </select>
                                    <label class="lable-text" for="floatingInput6">Gender</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="whatsapp_no"
                                        placeholder="whatsapp_no">
                                    <label class="lable-text" for="address">WhatsApp No.</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="number" class="form-control" id="experience"
                                        placeholder="experience">
                                    <label class="lable-text" for="board">Experience(years)</label>
                                </div>

                                <div class="form-floating mb-5">
                                    <select type="text" class="form-select" id="floatingInput6">
                                        <option value="0">Qualification</option>
                                        <option value="1">Graduate</option>
                                        <option value="2">BCA</option>      
                                        <option value="2">MCA</option>        
                                        <option value="2">BSC</option>        
                                        <option value="2">MSC</option>        
                                        <option value="2">B.Comm</option>          
                                        </select>
                                    <label class="lable-text" for="floatingInput6">Qualification</label>
                                </div>
                                
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="subject"
                                        placeholder="subject">
                                    <label class="lable-text" for="board">Subjects</label>
                                </div>

                                
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="teaching_days"
                                        placeholder="teaching_days">
                                    <label class="lable-text" for="board">Teaching days</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="timings"
                                        placeholder="timings">
                                    <label class="lable-text" for="board">Timings</label>
                                </div>

                                <div class="form-floating mb-5">
                                    <select type="text" class="form-select" id="floatingInput6">
                                        <option value="0">Teaching Mode</option>
                                        <option value="1">Online</option>
                                        <option value="2">Offline</option>
                                        <option value="2">Online & Offline</option>        
                                        <option value="2">Flying Tution</option>                
                                        </select>
                                    <label class="lable-text" for="floatingInput6">Teaching Mode</label>
                                </div>
                                
                                <div class="form-floating mb-5">
                                    <select type="text" class="form-select" id="floatingInput6">
                                        <option value="0">Board</option>
                                        <option value="1">ICSE</option>
                                        <option value="2">CBSE</option>    
                                        <option value="2">AISSCE</option>        
                                        <option value="2">SSC </option>            
                                        </select>
                                    <label class="lable-text" for="floatingInput6">Board</label>
                                </div>
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="address"
                                        placeholder="address">
                                    <label class="lable-text" for="address">Address</label>
                                </div>

                                <div class="form-floating mb-5">
                                    <select type="text" class="form-select" id="floatingInput6">
                                        <option value="0">State</option>
                                        <option value="1">Andra Pradesh</option>
                                        <option value="2">Arunachal Pradesh</option>
                                        <option value="2">Assam</option>        
                                        <option value="2">Bihar</option>        
                                        <option value="2">Chhattisgarh</option>        
                                        <option value="2">Goa</option>        
                                        <option value="2">Gujrat</option>        
                                        <option value="2">Haryana</option>        
                                        <option value="2">Himachal Pradesh</option>        
                                        <option value="2">Jharkhand</option>    
                                        <option value="2">Karnataka</option>        
                                        <option value="2">Kerala</option>        
                                        <option value="2">Madhya Pradesh</option>        
                                        <option value="2">Maharashtra</option>        
                                        <option value="2">Manipur</option>        
                                        <option value="2">Meghalaya</option>        
                                        <option value="2">Mizoram</option>        
                                        <option value="2">Nagaland</option>        
                                        <option value="2">odisha</option>        
                                        <option value="2">Punjab</option>        
                                        <option value="2">Rajasthan</option>        
                                        <option value="2">Sikkim</option>        
                                        <option value="2">Tamil Nadu</option>        
                                        <option value="2">Telangana</option>        
                                        <option value="2">Tripura</option>        
                                        <option value="2">Uttarakhand</option>        
                                        <option value="2">Uttar Pradesh</option>        
                                        <option value="2">West Bengal</option>        
                                        </select>
                                    <label class="lable-text" for="floatingInput6">State</label>
                                </div>
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="city"
                                        placeholder="city">
                                    <label class="lable-text" for="city">City</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="block"
                                        placeholder="block">
                                    <label class="lable-text" for="board">Block</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="street"
                                        placeholder="street">
                                    <label class="lable-text" for="board">Street</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="pincode"
                                        placeholder="pincode">
                                    <label class="lable-text" for="pincode">Pincode</label>
                                </div>
                                
                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="police_station"
                                        placeholder="police_station">
                                    <label class="lable-text" for="board">Post Office</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="text" class="form-control" id="police_station"
                                        placeholder="police_station">
                                    <label class="lable-text" for="board">Police Station</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="number" class="form-control" id="address"
                                        placeholder="address">
                                    <label class="lable-text" for="address">Latitude</label>
                                </div>

                                <div class="form-floating mb-5" class="col-lg-6">
                                    <input type="number" class="form-control" id="address"
                                        placeholder="address">
                                    <label class="lable-text" for="address">Longitude</label>
                                </div>
                                
                                <button type="submit" class="auth-btn w-100">Update</button>
                            </form> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- Contact us area -->
@endsection