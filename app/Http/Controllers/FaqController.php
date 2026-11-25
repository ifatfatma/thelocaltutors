<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\View\View;

use App\Models\Faq;
use Inertia\Inertia;
use App\Http\Requests\StoreFaqRequest;
use App\Http\Requests\UpdateFaqRequest;
use App\Helpers\HtmlSanitizer;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = Faq::latest('id')->paginate(50)->withQueryString();

        return Inertia::render('Admin/Faq/Index', [
            'faq' => $data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return redirect()->route('faq.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFaqRequest $request)
    {
        $faq = new Faq;
        $faq->title       = $request->title??'';
        $faq->description = HtmlSanitizer::clean($request->description ?? '');
        $faq->is_active   = $request->is_active??'';
        $faq->save();
        return redirect()->back()->withSuccess('FAQ is added successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Faq $faq)
    {
        return redirect()->route('faq.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFaqRequest $request,$id)
    {
        $faq = Faq::findorfail($id);
        $faq->title       = $request->title??'';
        $faq->description = HtmlSanitizer::clean($request->description ?? '');
        $faq->is_active   = $request->is_active??'';
        $faq->save();
        return redirect()->back()
        ->withSuccess('Information is updated successfully.'); 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $faq = Faq::findorfail($id);
        $faq->delete();
        return redirect()->back() 
                ->withSuccess('Record is deleted successfully.');
    }
}
