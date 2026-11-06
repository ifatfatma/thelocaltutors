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
                            <li>Shop Cart</li>
                        </ul>
                        <h4 class="mb-0">Shop Cart</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="product-cart-area">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="cart-table">
                        <div class="table-responsive">
                            <table class="table">
                                <thead class="table-navy">
                                    <th></th>
                                    <th></th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span class="icon-icon_close_alt2"></span></td>
                                        <td class="cart-pro-img"><img src="img/bg-img/inner/shop-1.png" alt=""></td>
                                        <td>Invisible Man</td>
                                        <td>$168.99</td>
                                        <td>
                                            <div class="qty-pro-area">
                                                <form class="cart-form">
                                                    <div class="order-plus-minus d-flex align-items-center">
                                                        <div class="quantity-button-handler">-</div>
                                                        <input class="form-control cart-quantity-input" type="text"
                                                            name="quantity" value="3">
                                                        <div class="quantity-button-handler">+</div>
                                                    </div>
                                                    <div class="fav-icon">
                                                        <i class="icon-icon_ribbon_alt"></i>
                                                    </div>
                                                </form>


                                            </div>
                                        </td>
                                        <td>$168.99</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        

                    </div>
                </div>

                <div class="col-12">
                    <div class="coupon-cart-btn-area">
                        <div class="apply-coupon">
                            <div class="coupon-form">
                                <h5>Have a discount code?</h5>
                                <form class="cop-form" action="#">
                                    <input class="form-control" type="text" placeholder="Coupon code">
                                    <button class="btn-copon" type="submit">Apply Coupon</button>
                                </form>
                            </div>
                            <button type="submit" class="update-btn">Update Cart</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row justify-content-end">
                <div class="col-lg-5 col-xl-4">
                    <div class="cart-total-card">
                        <h4>Cart totals</h4>
                        
                        <div class="cart-list">
                            <p>Subtotal</p>
                            <p>$541.88</p>
                        </div>

                        <div class="cart-list">
                            <div class="cart-tax-pri">
                                <p>Tax</p>
                                <p>US (8.375%)</p>
                            </div>
                            <p>$4.88</p>
                        </div>

                        <div class="total-order">
                            <h5>Order total</h5>
                            <div class="total-order-desc">
                                <h6>$545.88</h6>
                                <span>Excl. tax: $500.00</span>
                            </div>
                        </div>
                        <button type="submit" class="pro-btn mt-4"></a><span  class="icon-padlock"></span> Proceed to checkout</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection