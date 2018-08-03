<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username'); // default column from admin panel
            $table->dropColumn('name'); // default column from admin panel

            $table->string('email');
            $table->string('firstname');
            $table->string('secondname')->nullable();
            $table->string('phone')->nullable();
            $table->string('skype')->nullable();
            $table->boolean('email_public')->default(false);
            $table->boolean('phone_public')->default(false);
            $table->boolean('skype_public')->default(false);
            $table->string('city', 100)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('subdivision', 100)->nullable();
            $table->string('sphere', 100)->nullable();
            $table->string('about')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 190);
            $table->string('name', 190);

            $table->dropColumn('email');
            $table->dropColumn('phone');
            $table->dropColumn('firstname');
            $table->dropColumn('secondname');
            $table->dropColumn('skype');
            $table->dropColumn('email_public');
            $table->dropColumn('phone_public');
            $table->dropColumn('skype_public');
            $table->dropColumn('city');
            $table->dropColumn('country');
            $table->dropColumn('subdivision');
            $table->dropColumn('sphere');
            $table->dropSoftDeletes();
        });
    }
}
