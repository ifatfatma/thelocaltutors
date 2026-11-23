<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\TeacherDemo;
use App\Models\DemoShare;
use App\Models\Teacher;
use App\Models\ContactUs;
use App\Models\General_Setting;

class TeacherDemoController extends Controller
{
    /**
     * Teacher portal: List demos submitted by current user/teacher
     */
    public function teacherIndex()
    {
        $userId = Auth::id();
        $demos = TeacherDemo::where('user_id', $userId)
            ->latest()
            ->paginate(10);

        $teacher = Teacher::where('user_id', $userId)->first();

        return Inertia::render('Dashboard/TeacherDemos', [
            'demos' => $demos,
            'teacher' => $teacher,
        ]);
    }

    /**
     * Teacher portal: Submit a new recorded demo session
     */
    public function teacherStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:190',
            'class_level' => 'nullable|string|max:190',
            'video_url' => 'required|url|max:1000',
            'notes' => 'nullable|string|max:2000',
        ], [
            'title.required' => 'Please provide a descriptive title for this demo session.',
            'subject.required' => 'Please select or enter the subject taught.',
            'video_url.required' => 'Please provide a valid YouTube or Google Drive video link.',
            'video_url.url' => 'The video URL must be a valid web address.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->with('error', $validator->errors()->first());
        }

        $userId = Auth::id();
        $teacher = Teacher::where('user_id', $userId)->first();

        $embedUrl = TeacherDemo::convertToEmbedUrl($request->video_url);

        TeacherDemo::create([
            'user_id' => $userId,
            'teacher_id' => $teacher ? $teacher->id : null,
            'title' => trim($request->title),
            'subject' => trim($request->subject),
            'class_level' => trim($request->class_level ?? ''),
            'video_url' => trim($request->video_url),
            'video_embed_url' => $embedUrl,
            'notes' => trim($request->notes ?? ''),
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Your recorded demo class has been submitted for Super Admin review! You will be notified once approved.');
    }

    /**
     * Teacher portal: Delete a demo if still pending
     */
    public function teacherDestroy($id)
    {
        $demo = TeacherDemo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $demo->delete();

        return redirect()->back()->with('success', 'Demo submission removed successfully.');
    }

    /**
     * Super Admin: List all teacher demo submissions with filter
     */
    public function adminIndex(Request $request)
    {
        $status = $request->status;
        $query = TeacherDemo::with(['user', 'teacher'])->latest();

        if (in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
        }

        $demos = $query->paginate(15)->withQueryString();

        $counts = [
            'all' => TeacherDemo::count(),
            'pending' => TeacherDemo::where('status', 'pending')->count(),
            'approved' => TeacherDemo::where('status', 'approved')->count(),
            'rejected' => TeacherDemo::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/TeacherDemos/Index', [
            'demos' => $demos,
            'counts' => $counts,
            'currentStatus' => $status ?? 'all',
        ]);
    }

    /**
     * Super Admin: Approve or Reject a demo
     */
    public function adminUpdateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'admin_feedback' => 'nullable|string|max:1000',
        ]);

        $demo = TeacherDemo::findOrFail($id);
        $demo->status = $request->status;
        if ($request->has('admin_feedback')) {
            $demo->admin_feedback = $request->admin_feedback;
        }
        $demo->save();

        $msg = $demo->status === 'approved'
            ? "Demo session '{$demo->title}' has been APPROVED and is now ready to share with students!"
            : "Demo session '{$demo->title}' marked as {$demo->status}.";

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Super Admin: Delete demo submission
     */
    public function adminDestroy($id)
    {
        $demo = TeacherDemo::findOrFail($id);
        $demo->delete();

        return redirect()->back()->with('success', 'Demo submission deleted.');
    }

    /**
     * Super Admin: Share an approved demo with a student inquiry
     */
    public function adminShareDemo(Request $request)
    {
        $request->validate([
            'teacher_demo_id' => 'required|exists:teacher_demos,id',
            'student_name' => 'required|string|max:190',
            'student_phone' => 'required|string|max:30',
            'student_email' => 'nullable|email|max:190',
            'contact_id' => 'nullable|exists:contactus,id',
        ]);

        $demo = TeacherDemo::with('user')->findOrFail($request->teacher_demo_id);

        if ($demo->status !== 'approved') {
            return redirect()->back()->with('error', 'Only approved demo sessions can be shared with students.');
        }

        $token = Str::random(32);

        $share = DemoShare::create([
            'contact_id' => $request->contact_id,
            'teacher_demo_id' => $demo->id,
            'student_name' => trim($request->student_name),
            'student_phone' => trim($request->student_phone),
            'student_email' => trim($request->student_email ?? ''),
            'token' => $token,
            'status' => 'demo_shared',
            'shared_at' => now(),
        ]);

        // Clean phone for WhatsApp: remove non-digits
        $cleanPhone = preg_replace('/\D+/', '', $request->student_phone);
        if (strlen($cleanPhone) === 10) {
            $cleanPhone = '91' . $cleanPhone;
        }

        $demoViewUrl = route('front.demo.view', $token);
        $teacherName = $demo->user ? $demo->user->name : 'our expert educator';

        $waMessage = "Hello {$request->student_name}, greetings from The Local Tutors!\n\n"
            . "As requested, here is your exclusive recorded demo class for {$demo->subject} ({$demo->class_level}) by {$teacherName}:\n\n"
            . "▶ Watch Demo Class: {$demoViewUrl}\n\n"
            . "After watching, you can confirm your class schedule directly on the page or message us here. We look forward to assisting your learning journey!";

        $waUrl = "https://wa.me/{$cleanPhone}?text=" . rawurlencode($waMessage);

        return redirect()->back()->with([
            'success' => "Demo session successfully linked and shared for {$request->student_name}!",
            'shared_token' => $token,
            'demo_view_url' => $demoViewUrl,
            'whatsapp_url' => $waUrl,
        ]);
    }

    /**
     * Super Admin: View all shared demos & student booking requests
     */
    public function adminSharesList(Request $request)
    {
        $status = $request->status;
        $query = DemoShare::with(['teacherDemo.user', 'contact'])->latest();

        if ($status) {
            $query->where('status', $status);
        }

        $shares = $query->paginate(15)->withQueryString();
        $approvedDemos = TeacherDemo::with('user')->where('status', 'approved')->get();

        return Inertia::render('Admin/DemoShares/Index', [
            'shares' => $shares,
            'approvedDemos' => $approvedDemos,
            'currentStatus' => $status ?? 'all',
        ]);
    }

    /**
     * Super Admin: Delete shared demo link
     */
    public function adminShareDelete($id)
    {
        $share = DemoShare::findOrFail($id);
        $share->delete();

        return redirect()->back()->with('success', 'Shared demo record removed.');
    }

    /**
     * Public Student Demo View (`/demo-view/{token}`)
     */
    public function publicDemoView($token)
    {
        $share = DemoShare::with(['teacherDemo.user', 'teacherDemo.teacher'])
            ->where('token', $token)
            ->firstOrFail();

        // Update viewed status if first time
        if ($share->status === 'demo_shared') {
            $share->status = 'watched';
            $share->viewed_at = now();
            $share->save();
        }

        $teacherDemo = $share->teacherDemo;
        $settings = General_Setting::first();

        return Inertia::render('Front/DemoView', [
            'share' => $share,
            'teacherDemo' => $teacherDemo,
            'settings' => $settings,
        ]);
    }

    /**
     * Public Student Confirmation: Book Regular Classes from Demo View
     */
    public function confirmDemoBooking(Request $request, $token)
    {
        $share = DemoShare::where('token', $token)->firstOrFail();

        $request->validate([
            'preferred_schedule' => 'required|string|max:255',
            'student_notes' => 'nullable|string|max:1000',
        ], [
            'preferred_schedule.required' => 'Please let us know your preferred days or time slots.',
        ]);

        $share->preferred_schedule = $request->preferred_schedule;
        $share->student_notes = $request->student_notes;
        $share->status = 'booking_requested';
        $share->save();

        return redirect()->back()->with('success', 'Thank you! Your regular class booking request has been received. Our coordinator will contact you via WhatsApp / Phone to finalize your schedule.');
    }
}
