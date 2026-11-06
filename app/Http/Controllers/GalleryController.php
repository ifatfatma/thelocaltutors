<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Gallery;
use Illuminate\View\View;
use Inertia\Inertia;
use App\Http\Requests\StoreGalleryRequest;
use App\Http\Requests\UpdateGalleryRequest;
use Common;
use Intervention\Image\Laravel\Facades\Image;
use File;


class GalleryController extends Controller
{

    public function __construct()
    {
       $this->middleware('auth');
       $this->middleware('permission:view-gallery|create-gallery|edit-gallery|delete-gallery', ['only' => ['index','show']]);
       $this->middleware('permission:create-gallery', ['only' => ['create','store']]);
       $this->middleware('permission:edit-gallery', ['only' => ['edit','update']]);
       $this->middleware('permission:delete-gallery', ['only' => ['destroy']]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Gallery::latest('id')->paginate(50)->withQueryString();
        return Inertia::render('Admin/Gallery/Index', [
            'gallery' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create():View
    {
        return view('gallery.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $gallery = new Gallery;
        if(!empty($request->file('gallery_image'))){
        $image = Image::read($request->file('gallery_image'));

        // Main Image Upload on Folder Code
        $imageName = time().'-'.$request->file('gallery_image')->getClientOriginalName(); 
        $destinationPath = public_path('gallery/');
        $image->save($destinationPath.$imageName);

        // Generate Thumbnail Image Upload on Folder Code
        $destinationPathThumbnail = public_path('gallery/thumbnail/');
        $image->resize(100,100);
        $image->save($destinationPathThumbnail.$imageName);
        $gallery->gallery_image  = $imageName;
        $gallery->title       = $request->title??'';
        $gallery->is_active   = $request->is_active??0;
        $gallery->save();
        return redirect()->back()->withSuccess('Gallery added successfully.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Gallery $gallery)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gallery $gallery)
    {
        return view('gallery.edit',['gallery'=>$gallery]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGalleryRequest $request, $id)
    {
        $gallery = Gallery::findorfail($id);

        if(!empty($request->file('gallery_image'))){
            //unlink old image
            if(!empty($gallery->gallery_image)){
                $image_path = public_path('gallery/').$gallery->gallery_image;
                $image_path_thumb = public_path('gallery/thumbnail/').$gallery->gallery_image;
                if(File::exists($image_path)) {
                    File::delete($image_path);
                    File::delete($image_path_thumb);
                }
            }
            $image = Image::read($request->file('gallery_image'));
    
            // Main Image Upload on Folder Code
            $imageName = time().'-'.$request->file('gallery_image')->getClientOriginalName();
            $destinationPath = public_path('gallery/');
            $image->save($destinationPath.$imageName);
    
            // Generate Thumbnail Image Upload on Folder Code
            $destinationPathThumbnail = public_path('gallery/thumbnail/');
            $image->resize(100,100);
            $image->save($destinationPathThumbnail.$imageName);
            $gallery->gallery_image  = $imageName; 
        }
            
            $gallery->title       = $request->title??'';
            $gallery->is_active   = $request->is_active??0;
            $gallery->save();
            return redirect()->back()->withSuccess('gallery added successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $gallery = Gallery::findorfail($id);
        //unlink old image
        if(!empty($gallery->gallery_image)){
            $image_path = public_path('gallery/').$gallery->gallery_image;
            $image_path_thumb = public_path('gallery/thumbnail/').$gallery->gallery_image;
            if(File::exists($image_path)) {
                File::delete($image_path);
                File::delete($image_path_thumb);
            }
        }
        $gallery->delete();
        return redirect()->back()
                ->withSuccess('Record is deleted successfully.');
    }
}
