<?php

namespace App\Http\Controllers;

use App\Models\UserIpAndLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;  // If using Guzzle for API requests

class UserIpAndLocationController extends Controller
{
    public function store(Request $request)
    {
        // Get the currently authenticated user
        $user = Auth::user();

        // Get the user's IP address
        $ip = request()->ip();

        // Get the user's username
        $username = $user->name;

        // Get the user's location using ipinfo.io (or another API)
        $locationData = $this->getLocationByIp($ip);
        $location = isset($locationData['city']) ? $locationData['city'] : 'Unknown'; // Fallback to 'Unknown' if city is not available

        // Create a new entry in the user_ip_and_location table
        $userIpLocation = UserIpAndLocation::create([
            'user_id' => $user->id,
            'ip_address' => $ip,
            'username' => $username,
            'location' => $location,  // Store the location
        ]);

        return response()->json(['message' => 'User IP and location saved successfully.']);
    }

    // Helper method to fetch location data from ipinfo.io
    private function getLocationByIp($ip)
    {
        // Use ipinfo.io API to fetch the location data
        try {
            $accessToken = 'your_access_token_here'; // Replace with your ipinfo.io API token
            $url = "https://ipinfo.io/{$ip}/json?token={$accessToken}";
            $response = Http::get($url); // Using Laravel's HTTP client

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            // Handle any errors that may occur during the API request
            return [];
        }

        return []; // Return empty array if something goes wrong
    }
}
