<?php

namespace App\Http\Controllers;

use App\Models\CustomData;
use App\Http\Requests\StoreCustomDataRequest;
use App\Http\Requests\UpdateCustomDataRequest;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ImportCustomData;
use Inertia\Inertia;

use Common;
class CustomDataController extends Controller
{

    /**
     * Instantiate a new CustomDataController instance.
     */
    public function __construct()
    {
       $this->middleware('auth');
       $this->middleware('permission:view-customdata|create-customdata|edit-customdata|delete-customdata', ['only' => ['index','show']]);
       $this->middleware('permission:create-customdata', ['only' => ['create','store']]);
       $this->middleware('permission:edit-customdata', ['only' => ['edit','update']]);
       $this->middleware('permission:delete-customdata', ['only' => ['destroy']]);
    }

/**
    * @return \Illuminate\Support\Collection
    */
    public function import(Request $request) 
    {
        // Validate incoming request data
        $request->validate([
            'excelfile' => 'required|max:2048',
        ]);
  
        Excel::import(new ImportCustomData, $request->file('excelfile'));
                 
        return back()->with('success', 'Data imported successfully.');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $parent_id = $request->parent_id??0;
        $type = $request->type ?? 'state';
        $data = CustomData::withcount('subdata')->where('key_name',$type)->where('parent_id',$parent_id)->latest('id');
        $data = $data->paginate(50)->withQueryString();

        return Inertia::render('Admin/CustomData/Index', [
            'customdatas' => $data,
            'keyname' => $type,
            'parent_id' => $parent_id,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        return view('customdata.create');
    }

    /**
     * Store a newly created resource in storage.
     */
   
    public function store(StoreCustomDataRequest $request): RedirectResponse
    {
        
        $req = CustomData::create($request->all());
        $linkurl='';
        if(!empty($request->type)){
            $linkurl.='?type='.$request->type;
        }
        if(isset($request->parent_id)){
            $linkurl.='&parent_id='.$request->parent_id;
        }
        $req->key_name  = $request->type??'';
        $req->parent_id = $request->parent_id??0;
        $req->save();
        return redirect(route('customdata.index').$linkurl)
                ->withSuccess('New record is added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomData $customData): View
    {
        return view('customdata.show', [
            'customdata' => $customData
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id):View
    {
        $customdata =  CustomData::findorfail($id);
      
        return view('customdata.edit', [
            'customdata' => $customdata
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomDataRequest $request,$id)
    {
        $customData = CustomData::findorfail($id);
        $customData->update($request->all());
        return redirect()->back()
                         ->withSuccess('Information is updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $customData = CustomData::findorfail($id);
        $customData->delete();
        return redirect()->back()
                ->withSuccess('Record is deleted successfully.');
    }


    //get district
    public function getDistrictAjax($id){
        $data = CustomData::where('key_name','state')->where('parent_id',$id)->get();
        return response()->json($data);
    }
}
