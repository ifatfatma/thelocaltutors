<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Auth;
class UpdateCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'=>'required|string|max:192',
            'duration'=>'nullable|string|max:100',
            'price'=>'nullable',
            'price_type'=>'nullable|string|max:30',
            'teacher_id'=>'nullable',
            'teaching_mode'=>'nullable',
            'target_level'=>'nullable|string|max:192',
            'educator_status'=>'nullable|string|max:192',
            'curriculum'=>'nullable|string|max:192',
            'description'=>'nullable|string',
            'youtube_url'=>'nullable|string',
            'is_active'=>'nullable',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp'
        ];
    }
}
