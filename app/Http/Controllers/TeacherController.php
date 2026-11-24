<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use App\Models\CustomData;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

use Intervention\Image\Laravel\Facades\Image;
use File;
use Str;

class TeacherController extends Controller
{

    /**
     * Instantiate a new TeacherController instance.
     */
    public function __construct()
    {
       $this->middleware('auth');
       $this->middleware('permission:view-teacher|create-teacher|edit-teacher|delete-teacher', ['only' => ['index','show']]);
       $this->middleware('permission:create-teacher', ['only' => ['create','store']]);
       $this->middleware('permission:edit-teacher', ['only' => ['edit','update']]);
       $this->middleware('permission:delete-teacher', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = User::latest('id')->where('type','teacher');
        $teachers = $teachers->paginate(50)->withQueryString();
        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers
        ]);
    }

    public function indexlist()
    {
        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => User::where('type','teacher')->latest('id')->paginate(20)
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Teachers/Create');
    }

    /** 
     * Store a newly created resource in storage.
     */

    public function store(StoreTeacherRequest $request): RedirectResponse
    {
        $userData = $request->all();
        $userData['type'] = 'teacher';
        $userData['is_active'] = $request->input('is_active', 1);
        $user = User::create($userData);

        // Ensure teacher details record is created immediately so the teacher appears in search and showcase
        Teacher::firstOrCreate(['user_id' => $user->id]);

        if(!empty($request->file('image'))){
        $image = Image::read($request->file('image'));

        // Main Image Upload on Folder Code
        $imageName = time().'-'.$request->file('image')->getClientOriginalName();
        $destinationPath = public_path('users/');
        $image->save($destinationPath.$imageName);

        // Generate Thumbnail Image Upload on Folder Code
        $destinationPathThumbnail = public_path('users/thumbnail/');
        $image->resize(100,100);
        $image->save($destinationPathThumbnail.$imageName);
        $user->image = $imageName;
        $user->save();
        }

        return redirect()->route('teacher.index')
                ->withSuccess('New record is added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $teacher = User::with('teachermore')->where('id',$id)->first();

        return Inertia::render('Admin/Teachers/Show', [
            'teacher' => $teacher
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $teacher)
    {
        return Inertia::render('Admin/Teachers/Edit', [
            'teacher' => $teacher
        ]);
    }

    /*View of update more */
    public function updateview($id)
    {
        $teacher = Teacher::where('user_id', $id)->first();
        $states = CustomData::where('key_name', 'state')->where('parent_id', 0)->orderBy('name', 'asc')->get();
        $boards = CustomData::where('key_name', 'board')->orderBy('name', 'asc')->get();
        $subjects = CustomData::where('key_name', 'subject')->orderBy('name', 'asc')->get();
        $qualifications = CustomData::where('key_name', 'qualification')->orderBy('name', 'asc')->get();
        $modes = CustomData::where('key_name', 'teachmode')->orderBy('name', 'asc')->get();
        $days = CustomData::where('key_name', 'days')->orderBy('name', 'asc')->get();

        return Inertia::render('Admin/Teachers/UpdateMore', [
            'teacher' => $teacher,
            'user_id' => $id,
            'states' => $states,
            'boards' => $boards,
            'subjects' => $subjects,
            'qualifications' => $qualifications,
            'modes' => $modes,
            'days' => $days,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, User $teacher) :RedirectResponse
    {
        $teacher->update($request->all());

           if(!empty($request->file('image'))){
            //unlink old image
            if(!empty($teacher->image)){
                $image_path = public_path('user/').$teacher->image;
                $image_path_thumb = public_path('user/thumbnail/').$teacher->image;
                if(File::exists($image_path)) {
                    File::delete($image_path);
                    File::delete($image_path_thumb);
                }
            }
            $image = Image::read($request->file('image'));
            // Main Image Upload on Folder Code
            $imageName = time().'-'.$request->file('image')->getClientOriginalName();
            $destinationPath = public_path('user/');
            $image->save($destinationPath.$imageName);
    
            // Generate Thumbnail Image Upload on Folder Code
            $destinationPathThumbnail = public_path('user/thumbnail/');
            $image->resize(100,100);
            $image->save($destinationPathThumbnail.$imageName);
            $teacher->image = $imageName;
            $teacher->save();
            }
        return redirect()->back()
                         ->withSuccess('Teacher is updated successfully.');
    }

    
    /*
    update more details for teacher
    */

    public function updatemore(Request $request,$id)
    {
        $user                = Teacher::firstOrNew(['user_id' => $id]);
        $user->gender        = $request->gender ?? 'Male';
        $user->user_id       = $id ?? 0;
        $user->description   = $request->description ?? '';
        $user->whatsapp      = $request->whatsapp ?? '';
        $user->experience    = $request->experience ?? '';
        $user->qualification = is_array($request->qualification) ? implode(',', $request->qualification) : ($request->qualification ?? null);
        $user->address       = $request->address ? trim((string)$request->address) : '';
        $user->district      = $request->district ? trim((string)$request->district) : '';
        $user->city          = $request->city ? trim((string)$request->city) : '';
        $user->state         = $request->state ? trim((string)$request->state) : '';
        $user->pincode       = $request->pincode ? trim((string)$request->pincode) : '';
        $user->teaching_mode = is_array($request->teaching_mode) ? implode(',', $request->teaching_mode) : ($request->teaching_mode ?? null);
        $user->board         = is_array($request->board) ? implode(',', $request->board) : ($request->board ?? null);
        $user->subjects      = is_array($request->subjects) ? implode(',', $request->subjects) : ($request->subjects ?? null);
        $user->days          = is_array($request->days) ? implode(',', $request->days) : ($request->days ?? null);
        $user->timings       = $request->timings ?? '';
        $user->street        = $request->street ?? '';
        $user->block         = $request->block ?? '';
        $user->post_office   = $request->post_office ?? '';
        $user->police_station= $request->police_station ?? '';
        $user->latitude      = $request->latitude ?? '';
        $user->longitude     = $request->longitude ?? '';
        $user->save();
        return redirect()->back()
                         ->withSuccess('Teacher is updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $teacher):RedirectResponse
    {
        $teacher->delete();
        return redirect()->route('teacher.index')
                ->withSuccess('Teacher is deleted successfully.');
    }


    //restore
    public function restore($id)
    {
        $teacher = Teacher::withTrashed()->find($id);
        if($teacher && $teacher->trashed()){
           $teacher->restore();

        }
        return redirect()->back()->withSuccess('Record restored successfully');    }

    //forcedelete
    public function forcedelete($id){
        $teacher = User::withTrashed()->find($id);
        if($teacher && $teacher->trashed()){
           $teacher->forcedelete();
        }
        return redirect(config('services.envprefix').'/posremovecategory')->with(["status"=>200,"message"=>trans('category.recordadded')]);
    }

}
