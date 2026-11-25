<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_mobile'     => 'required|string',
            'user_password'   => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'user_mobile.required'   => 'Please enter your registered mobile number or email address.',
            'user_password.required' => 'Please enter your password.',
        ];
    }
}
