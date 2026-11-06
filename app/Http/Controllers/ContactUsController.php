<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ContactUs;

class ContactUsController extends Controller
{
    public function index(Request $request){
        $message = ContactUs::orderby('id','desc')->paginate(15);
        return Inertia::render('Admin/Messages/Index', compact('message'));
    }

    public function view($id){
        $messagesdetails = ContactUs::find($id);
        if ($messagesdetails) {
            $messagesdetails->is_read = 1;
            $messagesdetails->save();
        }
        return Inertia::render('Admin/Messages/View', compact('messagesdetails'));
    }

    public function destroy($id)
    {
        $messagesdetails = ContactUs::findorfail($id);
        $messagesdetails->delete();
        return redirect()->back()
                ->withSuccess('Record is deleted successfully.');
    }
}
