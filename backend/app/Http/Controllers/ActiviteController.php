<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ActiviteController extends Controller
{

    // GET ALL
    public function index()
    {
        return response()->json(
            Activite::all(),
            200
        );
    }


    // CREATE
    public function store(Request $request)
    {

        $data = $request->all();

        try {

            $data['date_debut'] = Carbon::createFromFormat('d/m/Y', $data['date_debut'])->format('Y-m-d');

            $data['date_fin'] = Carbon::createFromFormat('d/m/Y', $data['date_fin'])->format('Y-m-d');

        } catch (\Exception $e) {

            return response()->json([
                'error' => 'Format date invalide (dd/mm/yyyy)'
            ], 422);

        }

        $request->merge($data);

        $request->validate([

            'nom_activite' => 'required|string',
            'statut' => 'required|string',
            'responsable' => 'required|string',
            'participants' => 'nullable|array',
            'commentaire' => 'nullable|string',

            'date_debut' => 'required|date',
            'date_fin' => 'required|date',

        ]);

        $activite = Activite::create($data);

        return response()->json($activite,201);
    }


    // GET ONE
    public function show($id)
    {
        $activite = Activite::findOrFail($id);

        return response()->json($activite,200);
    }


    // UPDATE
    public function update(Request $request,$id)
    {

        $activite = Activite::findOrFail($id);

        $data = $request->all();

        try {

            if(isset($data['date_debut'])){
                $data['date_debut'] = Carbon::createFromFormat('d/m/Y',$data['date_debut'])->format('Y-m-d');
            }

            if(isset($data['date_fin'])){
                $data['date_fin'] = Carbon::createFromFormat('d/m/Y',$data['date_fin'])->format('Y-m-d');
            }

        } catch (\Exception $e) {

            return response()->json([
                'error'=>'Format date invalide'
            ],422);

        }

        $request->merge($data);

        $request->validate([

            'nom_activite' => 'sometimes|required|string',
            'statut' => 'sometimes|required|string',
            'responsable' => 'sometimes|required|string',
            'participants' => 'sometimes|array',
            'commentaire' => 'nullable|string',

            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date',

        ]);

        $activite->update($data);

        return response()->json($activite,200);
    }


    // DELETE
    public function destroy($id)
    {

        Activite::destroy($id);

        return response()->json([
            'message'=>'Activite supprimée'
        ],200);

    }


    // SEARCH
    public function search($keyword)
    {

        $activites = Activite::where('nom_activite','like',"%$keyword%")
        ->orWhere('responsable','like',"%$keyword%")
        ->orWhere('statut','like',"%$keyword%")
        ->get();

        return response()->json($activites,200);

    }

}