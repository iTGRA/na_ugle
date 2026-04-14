<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:50'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time' => ['nullable', 'string', 'max:10'],
            'guests' => ['required', 'integer', 'min:1', 'max:50'],
            'comment' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Укажите имя',
            'phone.required' => 'Укажите телефон',
            'date.required' => 'Укажите дату',
            'date.after_or_equal' => 'Дата должна быть сегодня или позже',
            'guests.required' => 'Укажите количество гостей',
            'guests.min' => 'Минимум 1 гость',
            'guests.max' => 'Максимум 50 гостей',
        ];
    }
}
