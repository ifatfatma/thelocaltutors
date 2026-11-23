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
            'duration'=>'nullable',
            'price'=>'nullable',
            'teacher_id'=>'nullable',
            'teaching_mode'=>'nullable',
            'description'=>'nullable|string',
            'youtube_url'=>'nullable|string',
            'is_active'=>'nullable',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp'
        ];
    }
}
