<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ContactUs;
use App\Models\TeacherDemo;
use App\Models\DemoShare;

class ContactUsController extends Controller
{
    public function index(Request $request)
    {
        $message = ContactUs::orderby('id', 'desc')->paginate(15);
        $approvedDemos = TeacherDemo::with('user')->where('status', 'approved')->get();

        return Inertia::render('Admin/Messages/Index', compact('message', 'approvedDemos'));
    }

    public function view($id)
    {
        $messagesdetails = ContactUs::findOrFail($id);
        $messagesdetails->is_read = 1;
        $messagesdetails->save();

        $approvedDemos = TeacherDemo::with('user')->where('status', 'approved')->get();
        $shares = DemoShare::where('contact_id', $id)->with('teacherDemo.user')->latest()->get();

        return Inertia::render('Admin/Messages/View', compact('messagesdetails', 'approvedDemos', 'shares'));
    }

    public function destroy($id)
    {
        $messagesdetails = ContactUs::findorfail($id);
        $messagesdetails->delete();

        return redirect()->back()->withSuccess('Record is deleted successfully.');
    }
}
