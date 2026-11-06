<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Auth;
class StoreTeacherRequest extends FormRequest
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
            'email'    => 'required|email|unique:users,email|string|max:192',
            'mobile'   => 'required|numeric|unique:users,mobile',
            'username' => 'required|unique:users,username',
            'password' => 'required',
            'image'    => 'required|image|mimes:jpg,jpeg,png,webp'
        ];
    }
}
