<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

class RegisterRequest extends FormRequest
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
        $email = strtolower(trim((string) $this->input('email', '')));
        $pendingUser = $email !== ''
            ? User::where('email', $email)->where('is_active', 0)->first()
            : null;

        $emailUnique = Rule::unique('users', 'email');
        $mobileUnique = Rule::unique('users', 'mobile');
        if ($pendingUser) {
            $emailUnique->ignore($pendingUser->id);
            $mobileUnique->ignore($pendingUser->id);
        }

        return [
            'usertype'          => 'required|in:student,teacher',
            'name'              => 'required|string|max:192',
            'email'             => ['required', 'email', 'max:192', $emailUnique],
            'mobile'            => ['required', 'regex:/^[0-9]{10}$/', $mobileUnique],
            'password'          => 'required|min:6',
            'terms'             => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'mobile.regex' => 'The mobile number must be a valid 10-digit phone number.',
            'mobile.unique' => 'This mobile number is already registered.',
            'email.unique' => 'This email address is already registered.',
        ];
    }
}
