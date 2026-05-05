<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RenamerController extends Controller
{
    public function renamer(Request $request)
    {
        return response()->json([
    'message' => 'ok'
        ]);
    }
}
