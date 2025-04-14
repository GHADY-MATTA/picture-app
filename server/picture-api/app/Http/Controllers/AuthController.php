<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use App\Models\UserIpAndLocation; // Add the UserIpAndLocation model for storing the IP and location
use Illuminate\Support\Facades\Http; // Laravel's HTTP client for external API requests

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully',
                'token' => $token,
                'user' => [
                    'name' => $user->name,
                ]
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Register Error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong, please try again later.'
            ], 500);
        }
    }

    /**
     * Login a user
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Store the user's IP and location after successful login
            $this->storeUserIpAndLocation($user);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong, please try again later.'
            ], 500);
        }
    }

    /**
     * Store the user's IP and location
     */
    private function storeUserIpAndLocation($user)
    {
        try {
            // Get the user's IP address
            $ip = request()->ip();

            // Fetch the user's location based on the IP address (using ipinfo.io or any IP geolocation service)
            $locationData = $this->getLocationByIp($ip);
            $location = $locationData ? $locationData['city'] : 'Unknown';  // Get the city, or fallback to 'Unknown'

            // Store the user's IP and location
            UserIpAndLocation::create([
                'user_id' => $user->id,
                'ip_address' => $ip,
                'username' => $user->name,
                'location' => $location
            ]);
        } catch (\Exception $e) {
            Log::error('Error saving user IP and location: ' . $e->getMessage());
        }
    }

    /**
     * Fetch location data using ipinfo.io or any other IP geolocation service
     */
    private function getLocationByIp($ip)
    {
        try {
            // Replace with your actual ipinfo.io access token
            $accessToken = 'your_access_token_here';
            $url = "https://ipinfo.io/{$ip}/json?token={$accessToken}";

            // Use Laravel's HTTP client to get the location data
            $response = Http::get($url);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            return null;
        }

        return null; // Return null if the API call fails
    }

    /**
     * Logout the authenticated user
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Logout Error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Logout failed. Please try again later.'
            ], 500);
        }
    }
}
