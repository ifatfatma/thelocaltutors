<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ChangePasswordRequest;
use Illuminate\Support\Facades\Hash;
use App\Models\SinglePage;
use Inertia\Inertia;

use Auth;
use App\Models\User;

class FontDashboardController extends Controller
{

    public function logout(){
        auth()->logout();
        return redirect(route('front.login'))->with('success','You have successfully loggedout.');
    }
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function index(){
        $user = Auth::user();
        if ($user && ($user->type === 'admin' || (method_exists($user, 'hasRole') && ($user->hasRole('Admin') || $user->hasRole('Super Admin'))))) {
            return redirect()->route('home');
        }
        $pageData = SinglePage::where('id',5)->first();        
        return Inertia::render('Dashboard/Index', compact('pageData'));
    }

 
    //change password
    public function ChangePasswordPost(ChangePasswordRequest $request){

        $currentPasswordStatus = Hash::check($request->current_password, auth()->user()->password);
        if($currentPasswordStatus){
            User::findOrFail(Auth::user()->id)->update([
                'password' => Hash::make($request->new_password),
            ]);

            return response()->json(['message' => 'Current password has been updated successfully']);

        }else{

            return response()->json(['message' => 'Invalid current password'],422);
        }
    }
}
