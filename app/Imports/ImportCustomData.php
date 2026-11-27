<?php

namespace App\Imports;

use App\Models\CustomData;
use Maatwebsite\Excel\Concerns\ToModel;
use Log;
class ImportCustomData implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if (empty($row[0]) || empty($row[1])) {
            return null;
        }

        $name = trim((string) $row[0]);
        $keyName = trim((string) $row[1]);
        $parentId = isset($row[2]) && is_numeric($row[2]) ? (int) $row[2] : 0;

        $jewdata = CustomData::where('name', $name)
            ->where('key_name', $keyName)
            ->where('parent_id', $parentId)
            ->first();

        if (empty($jewdata->id)) {
            $newdata = new CustomData;
            $newdata->name = $name;
            $newdata->key_name = $keyName;
            $newdata->parent_id = $parentId;
            $newdata->is_active = 1;
            $newdata->created_at = date('Y-m-d H:i:s');
            $newdata->updated_at = date('Y-m-d H:i:s');
            return $newdata;
        }

        return null;
    }
}
