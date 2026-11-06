<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Auth;
class UpdateTeacherRequest extends FormRequest
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
            'name'     => 'required|string|max:192',
            'email'    => 'required|email|string|max:192|unique:users,email,'.$this->teacher->id,
            'mobile'   => 'required|numeric|unique:users,mobile,'.$this->teacher->id,
            'username' => 'required|unique:users,username,'.$this->teacher->id,
            'image'    => 'nullable|image|mimes:jpg,jpeg,png'
        ];
    }
}
