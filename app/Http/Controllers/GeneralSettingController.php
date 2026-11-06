<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\General_Setting;
use Illuminate\View\View;
use Intervention\Image\Laravel\Facades\Image;
use File;
use Str;
use Inertia\Inertia;
class GeneralSettingController extends Controller
{
    public function index()
    {
        $generalsettings = General_Setting::findorfail(1);
    
        return Inertia::render('Admin/Settings/Index', [
            'generalsettings' => $generalsettings
        ]);
    }

    public function addsettings(Request $request)
    {


        $request->validate([
            'name' => 'required|string|max:192',
            'mobile' => 'nullable|numeric',
        ]);


        $generalsettings = General_Setting::find(1);
        $imageName='';
        if(!empty($request->file('logo'))){
            //unlink old image
            if(!empty($generalsettings->logo)){
                $image_path = public_path('generalsettings/').$generalsettings->logo;
                $image_path_thumb = public_path('generalsettings/thumbnail/').$generalsettings->logo;
                if(File::exists($image_path)) {
                    File::delete($image_path);
                    File::delete($image_path_thumb);
                }
            }
            $image = Image::read($request->file('logo'));
            // Main Image Upload on Folder Code
            $imageName = time().'-'.$request->file('logo')->getClientOriginalName();
            $destinationPath = public_path('generalsettings/');
            $image->save($destinationPath.$imageName);
    
            // Generate Thumbnail Image Upload on Folder Code
            $destinationPathThumbnail = public_path('generalsettings/thumbnail/');
            $image->resize(100,100);
            $image->save($destinationPathThumbnail.$imageName);
            $generalsettings->logo = $imageName;
            }
        $generalsettings->name = $request->name??'';
        if (!empty($imageName)) {
            $generalsettings->logo = $imageName;
        }
        $generalsettings->mobile = $request->mobile??'';
        $generalsettings->email = $request->email??'';
        $generalsettings->address = $request->address??'';
        $generalsettings->whatsapp = $request->whatsapp??'';
        $generalsettings->facebook = $request->facebook??'';
        $generalsettings->twitter = $request->twitter??'';
        $generalsettings->youtube = $request->youtube??'';
        $generalsettings->googleplus = $request->googleplus??'';
        $generalsettings->linkedin = $request->linkedin??'';
        $generalsettings->instagram = $request->instagram??'';
        $generalsettings->google_map = $request->google_map??'';
        $generalsettings->is_active = $request->is_active??'';
        $generalsettings->save();
        return redirect()->back()
                         ->withSuccess('General Setting has been updated successfully');
    }
}
