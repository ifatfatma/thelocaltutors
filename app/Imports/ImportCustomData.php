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


$jewdata = CustomData::where('name',$row[0])->where('key_name',$row[1])->where('parent_id',$row[2])->first();
if(empty($jewdata->id)){
    //Log::info(json_encode($row));
    $newdata = new CustomData;
    $newdata->name = $row[0];
    $newdata->key_name = $row[1];
    $newdata->parent_id = $row[2];
    $newdata->is_active = 1;
    $newdata->created_at = date('Y-m-d H:i:s');
    $newdata->updated_at = date('Y-m-d H:i:s');
    //$newdata->save();
    return $newdata;
}
//Log::info(json_encode($jewdata));
        /* return new CustomData([
            'name'      => $row[0],
            'key_name'  => $row[1], 
            'parent_id' => $row[2], 
            'is_active' => 1, 
            'created_at'=>date('Y-m-d H:i:s'),
            'updated_at'=>date('Y-m-d H:i:s')
        ]); */ 
    }
}
