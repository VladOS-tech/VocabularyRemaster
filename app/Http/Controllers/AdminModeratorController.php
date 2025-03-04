<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Moderator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminModeratorController extends Controller
{
    public function index()
    {
        $moderators = Moderator::with('user')->get();
        return response()->json($moderators);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'contact' => 'required|string|max:255|unique:moderators,contact'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'password' => Hash::make($validated['password']),
            'role_id' => 2
        ]);

        $moderator = Moderator::create([
            'user_id' => $user->id,
            'contact' => $validated['contact']
        ]);

        return response()->json($moderator, 201);
    }

    public function update(Request $request, $id)
    {
        $moderator = Moderator::findOrFail($id);
        $user = $moderator->user;

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'password' => 'sometimes|string|min:6',
            'contact' => 'sometimes|string|max:255|unique:moderators,contact,' . $id
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        if (isset($validated['contact'])) {
            $moderator->contact = $validated['contact'];
        }
        $moderator->save();

        return response()->json($moderator);
    }

    public function destroy($id)
    {
        $moderator = Moderator::findOrFail($id);
        $user = $moderator->user;

        $moderator->delete();
        $user->delete();

        return response()->json(['message' => 'Модератор удалён']);
    }
}
