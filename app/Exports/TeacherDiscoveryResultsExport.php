<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TeacherDiscoveryResultsExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(private Collection $results)
    {
    }

    public function collection(): Collection
    {
        return $this->results;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Teacher Name',
            'Email',
            'Phone',
            'WhatsApp',
            'Gender',
            'Country',
            'State',
            'City',
            'Locality',
            'Subjects',
            'Qualification',
            'Experience',
            'Teaching Mode',
            'Hourly Fees',
            'Institute / School',
            'Source Name',
            'Source URL',
            'Duplicate Status',
            'Import Status',
            'Verification Status',
            'Discovered At',
        ];
    }

    public function map($r): array
    {
        return [
            $r->id,
            $r->teacher_name,
            $r->email,
            $r->phone,
            $r->whatsapp,
            $r->gender,
            $r->country,
            $r->state,
            $r->city,
            $r->locality,
            is_array($r->subjects) ? implode(', ', $r->subjects) : $r->subjects,
            $r->qualification,
            $r->experience,
            $r->teaching_mode,
            $r->hourly_fees,
            $r->institute_name,
            $r->source_name,
            $r->source_url,
            $r->duplicate_status,
            $r->import_status,
            $r->verification_status,
            $r->created_at ? $r->created_at->format('Y-m-d H:i:s') : '',
        ];
    }
}
