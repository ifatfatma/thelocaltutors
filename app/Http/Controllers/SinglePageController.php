<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\View\View;

use App\Models\SinglePage;
use Inertia\Inertia;
use App\Http\Requests\StoreSinglePageRequest;
use App\Http\Requests\UpdateSinglePageRequest;

class SinglePageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = SinglePage::latest('id')->paginate(50)->withQueryString();

        return Inertia::render('Admin/SinglePages/Index', [
            'singlepages' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return redirect()->route('singlepages.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSinglePageRequest $request)
    {
        $singlepage = new SinglePage;
        $singlepage->title       = $request->title??'';
        $singlepage->key_name    = $request->key_name??'';
        $singlepage->description = \App\Helpers\HtmlSanitizer::clean($request->description);
        $singlepage->is_active   = $request->is_active??'';
        $singlepage->save();
        return redirect()->back()->withSuccess('Single Page is added successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(SinglePage $singlePage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource. 
     */
    public function edit($id)
    {
        $singlepages = SinglePage::find($id);
        return Inertia::render('Admin/SinglePages/Edit', ['singlepages' => $singlepages]);

    }

    /** 
     * Update the specified resource in storage.
     */
    public function update(UpdateSinglePageRequest $request,$id)
    {
        $singlepage = SinglePage::findorfail($id);
        $singlepage->title       = $request->title??'';
        $singlepage->key_name    = $request->key_name??'';
        $singlepage->description = \App\Helpers\HtmlSanitizer::clean($request->description);
        $singlepage->is_active   = $request->is_active??'';
        $singlepage->save();
        return redirect()->back()
        ->withSuccess('Information is updated successfully.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $singlepage = SinglePage::findorfail($id);
        $singlepage->delete();
        return redirect()->back()
                ->withSuccess('Record is deleted successfully.');
    }
}
