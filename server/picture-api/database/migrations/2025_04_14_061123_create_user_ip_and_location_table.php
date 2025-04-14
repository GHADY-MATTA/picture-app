<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserIpAndLocationTable extends Migration
{
    public function up()
    {
        Schema::create('user_ip_and_location', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User foreign key
            $table->string('ip_address'); // Store user's IP address
            $table->string('username'); // Store user's username
            $table->string('location')->nullable(); // Store user's location (e.g., city, country)
            $table->timestamp('login_time')->useCurrent(); // Timestamp of login
            $table->timestamps(); // Automatically adds created_at and updated_at fields
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_ip_and_location'); // Correct table name
    }
}
