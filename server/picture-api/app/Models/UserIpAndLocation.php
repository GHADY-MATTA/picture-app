<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserIpAndLocation extends Model
{
    use HasFactory;

    // Explicitly set the table name to match your migration (singular)
    protected $table = 'user_ip_and_location';  // Use singular here

    // Define the fillable attributes for mass assignment
    protected $fillable = ['user_id', 'ip_address', 'username', 'login_time', 'location']; // Include 'location'

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
