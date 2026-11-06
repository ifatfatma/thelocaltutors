@extends('front.layouts.layouts')

@section('content')
    <div class="breadcrumb-area-2 bg-overlay-3 relative bg-img"
        style="background-image: url(img/bg-img/home-3/bg.png);">
        <div class="container h-100">
            <div class="row h-100 align-items-center">
                <div class="col-12">
                    <div class="breadcrumb-conetnt">
                        <ul class="bread-list">
                            <li><a href="#">Home</a></li>
                            <li><i class="icon-down-arrow-11"></i></li>
                            <li>Checkout</li>
                        </ul>
                        <h4 class="mb-0">Checkout</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Checkout Page area -->
    <div class="checkout-page-area">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="client-address-area">
                        <div class="row">
                            <div class="col-12">
                                <div class="checkout-heading">
                                    <h4>Billing details</h4>
                                </div>
                            </div>
                            <div class="col-md-6 mb-4">
                                <label for="firstName" class="form-label">First name *</label>
                                <input type="text" class="form-control" id="firstName" placeholder="" value=""
                                    required="">
                            </div>

                            <div class="col-md-6 mb-4">
                                <label for="lastName" class="form-label">Last name *</label>
                                <input type="text" class="form-control" id="lastName" placeholder="" value=""
                                    required="">
                            </div>

                            <div class="col-12 mb-4">
                                <label for="comName" class="form-label">Company name (optional)</label>
                                <input type="text" class="form-control" id="comName" placeholder="" value=""
                                    required="">
                            </div>

                            <div class="col-12 mb-4">
                                <label for="country" class="form-label">Country / Region *</label>
                                <select class="form-select" id="country" required>
                                    <option value="">Choose...</option>
                                    <option>United States</option>
                                    <option>United kingdom</option>
                                </select>

                            </div>

                            <div class="col-12 mb-4">
                                <label for="address" class="form-label">Steet address line 1*</label>
                                <input type="text" class="form-control" id="address" placeholder="" required="">
                            </div>

                            <div class="col-12 mb-4">
                                <input type="text" class="form-control" id="address1" placeholder="" required="">
                            </div>

                            <div class="col-12 mb-4">
                                <label for="country2" class="form-label">Town / City *</label>
                                <select class="form-select" id="country2" required>
                                    <option value="">Choose...</option>
                                    <option>United States</option>
                                    <option>United kingdom</option>
                                </select>
                            </div>

                            <div class="col-md-6 mb-4">
                                <label for="zip" class="form-label">Zip/ Postal code *</label>
                                <input type="text" class="form-control" id="zip" placeholder="" required="">

                            </div>
                            <div class="col-md-6 mb-4">
                                <label for="phone" class="form-label">Phone Number</label>
                                <input type="number" class="form-control" id="phone" placeholder="" required="">
                            </div>

                            <div class="col-12">
                                <label for="email" class="form-label">Email address *</label>
                                <input type="email" class="form-control" id="email" placeholder="">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="row">
                        <div class="col-12">
                            <div class="checkout-heading">
                                <h4>Additional information</h4>
                            </div>
                        </div>
                        <div class="col-12 mb-5">
                            <label for="lastName" class="form-label">Order notes (optional)</label>
                            <textarea class="form-control"
                                placeholder="Note about your order, e.g spacial nots for delivery." id="message"
                                name="message" cols="30" rows="10"></textarea>
                        </div>

                        <div class="col-12">
                            <div class="checkout-order-area">
                                <h4>Your Order</h4>
                                <ul class="order-list-check mb-5">
                                    <li class="order-list-header"><span class="heading-title-pro">Product</span>
                                        <span class="heading-title-pro">Subtotal</span></li>
                                    <li class="order-list-info-pro"><span class="product-list-single">
                                            <img class="order-product" src="img/bg-img/inner/shop-6.png"
                                                alt="">Idealist Pore
                                            Mizing</span>
                                        <span class="pro-price">$541.88</span>
                                    </li>
                                    <li class="order-price"><span>Subtotal</span> <span
                                            class="pur-price">$541.88</span></li>
                                    <li class="order-price"><span>Total</span> <span
                                            class="pur-price">$541.88</span></li>
                                </ul>

                                <h4 class="mb-3">Payment</h4>

                                <div class="payment-gate-sys">
                                    <div class="form-check mb-4">
                                        <input id="credit" name="paymentMethod" type="radio"
                                            class="form-check-input" checked required>
                                        <label class="form-check-label" for="credit">Credit card</label>
                                    </div>
                                    <div class="form-check mb-4">
                                        <input id="debit" name="paymentMethod" type="radio"
                                            class="form-check-input" required>
                                        <label class="form-check-label" for="debit">Debit card</label>
                                    </div>
                                    <div class="form-check mb-4">
                                        <input id="paypal" name="paymentMethod" type="radio"
                                            class="form-check-input" required>
                                        <label class="form-check-label" for="paypal">PayPal</label>
                                    </div>
                                </div>
                                <div class="pay-policy-des">
                                    <p> Your personal data will be used to process your order, support your
                                        experience throughout this website, and for other purposes described in
                                        our privacy policy.</p>
                                </div>
                                <div class="post-btn-area">
                                    <button type="submit" class="auth-btn post">Post Comment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Checkout Page area -->

@endsection