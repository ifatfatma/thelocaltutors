<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Models\Blog; 
use App\Models\BlogFeedback; 
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use Illuminate\Http\RedirectResponse;
use Common;
use Intervention\Image\Laravel\Facades\Image;
use File;
use Inertia\Inertia;

 
class BlogController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
       $this->middleware('permission:view-blog|create-blog|edit-blog|delete-blog', ['only' => ['index','show']]);
       $this->middleware('permission:create-blog', ['only' => ['create','store']]);
       $this->middleware('permission:edit-blog', ['only' => ['edit','update']]);
       $this->middleware('permission:delete-blog', ['only' => ['destroy']]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Blog::latest('id')->paginate(50)->withQueryString();
        return Inertia::render('Admin/Blogs/Index', [
            'blog' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Blogs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBlogRequest $request):RedirectResponse
    {
        $blog = new Blog;
        try {
            if(!empty($request->file('blog_image'))){
                $image = Image::read($request->file('blog_image'));
                $imageName = time().'-'.$request->file('blog_image')->getClientOriginalName();
                $destinationPath = public_path('blog/');
                $destinationPathThumbnail = public_path('blog/thumbnail/');
                File::ensureDirectoryExists($destinationPath);
                File::ensureDirectoryExists($destinationPathThumbnail);
                $image->save($destinationPath.$imageName);
                $image->resize(100,100);
                $image->save($destinationPathThumbnail.$imageName);
                $blog->blog_image  = $imageName;
            }

            if(!empty($request->file('blog_cover_image'))){
                $image = Image::read($request->file('blog_cover_image'));
                $coverimageName = time().'-'.$request->file('blog_cover_image')->getClientOriginalName();
                $destinationPath = public_path('blog_cover_image/');
                $destinationPathThumbnail = public_path('blog_cover_image/thumbnail/');
                File::ensureDirectoryExists($destinationPath);
                File::ensureDirectoryExists($destinationPathThumbnail);
                $image->save($destinationPath.$coverimageName);
                $image->resize(100,100);
                $image->save($destinationPathThumbnail.$coverimageName);
                $blog->blog_cover_image  = $coverimageName;
            }
        } catch (\Throwable $e) {
            return redirect()->back()->withInput()->with('error', 'Failed to process uploaded blog image: ' . $e->getMessage());
        }

        $blog->title       = $request->title??'';
        $blog->short_description = $request->short_description??'';
        $blog->description = \App\Helpers\HtmlSanitizer::clean($request->description);
        $blog->blog_by     = $request->blog_by??'';
        $blog->date        = $request->date??'';
        $blog->is_active   = $request->is_active??0;
        $blog->save();
        return redirect()->back()->withSuccess('blog added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        return Inertia::render('Admin/Blogs/Edit', ['blog' => $blog]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlogRequest $request, $id)
    {
        $blog = Blog::findorfail($id);

        try {
            if(!empty($request->file('blog_image'))){
                if(!empty($blog->blog_image)){
                    $image_path = public_path('blog/').$blog->blog_image;
                    $image_path_thumb = public_path('blog/thumbnail/').$blog->blog_image;
                    if(File::exists($image_path)) {
                        File::delete($image_path);
                        File::delete($image_path_thumb);
                    }
                }
                $image = Image::read($request->file('blog_image'));
                $imageName = time().'-'.$request->file('blog_image')->getClientOriginalName();
                $destinationPath = public_path('blog/');
                $destinationPathThumbnail = public_path('blog/thumbnail/');
                File::ensureDirectoryExists($destinationPath);
                File::ensureDirectoryExists($destinationPathThumbnail);
                $image->save($destinationPath.$imageName);
                $image->resize(100,100);
                $image->save($destinationPathThumbnail.$imageName);
                $blog->blog_image  = $imageName;
            }

            if(!empty($request->file('blog_cover_image'))){
                if(!empty($blog->blog_cover_image)){
                    $image_path = public_path('blog_cover_image/').$blog->blog_cover_image;
                    $image_path_thumb = public_path('blog_cover_image/thumbnail/').$blog->blog_cover_image;
                    if(File::exists($image_path)) {
                        File::delete($image_path);
                        File::delete($image_path_thumb);
                    }
                }
                $image = Image::read($request->file('blog_cover_image'));
                $coverimageName = time().'-'.$request->file('blog_cover_image')->getClientOriginalName();
                $destinationPath = public_path('blog_cover_image/');
                $destinationPathThumbnail = public_path('blog_cover_image/thumbnail/');
                File::ensureDirectoryExists($destinationPath);
                File::ensureDirectoryExists($destinationPathThumbnail);
                $image->save($destinationPath.$coverimageName);
                $image->resize(100,100);
                $image->save($destinationPathThumbnail.$coverimageName);
                $blog->blog_cover_image  = $coverimageName;
            }
        } catch (\Throwable $e) {
            return redirect()->back()->withInput()->with('error', 'Failed to process uploaded blog image: ' . $e->getMessage());
        }
            
            $blog->title       = $request->title??'';
            $blog->short_description = $request->short_description??'';
            $blog->description = \App\Helpers\HtmlSanitizer::clean($request->description);
            $blog->blog_by     = $request->blog_by??'';
            $blog->date        = $request->date??'';
            $blog->is_active   = $request->is_active??0;
            $blog->save();
            return redirect()->back()->withSuccess('blog added successfully.');
            
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $blog = Blog::findorfail($id);
        //unlink old image
        if(!empty($blog->blog_image)){
            $image_path = public_path('blog/').$blog->blog_image;
            $image_path_thumb = public_path('blog/thumbnail/').$blog->blog_image;
            if(File::exists($image_path)) {
                File::delete($image_path);
                File::delete($image_path_thumb);
            }
        }
        $blog->delete();
        return redirect()->back()
                ->withSuccess('Record is deleted successfully.');
    }

    public function blogfeedback(Request $request)
    {
        $blogfeedback = BlogFeedback::with('user','blog')->latest('id');
        $blogfeedback = $blogfeedback->paginate(50)->withQueryString();
        return Inertia::render('Admin/Feedback/BlogFeedback', compact('blogfeedback'));
    }

    public function acceptblogfeedback($id)
    {
        $blogfeedback = BlogFeedback::findorfail($id);
        $blogfeedback->is_active = 1;
        $blogfeedback->save();
        return redirect()->back()->withSuccess('Feedback Accepted');
    }

    public function destroyblogfeedback($id)
    {
        $blogfeedback = BlogFeedback::findorfail($id);
        $blogfeedback->forceDelete(); 
        return redirect()->back()->withSuccess('Feedback deleted successfully.');
    }
}
 