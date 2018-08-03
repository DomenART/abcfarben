<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->mediumText('content')->nullable();
            $table->string('dialog_title')->nullable();
            $table->mediumText('dialog_content')->nullable();
            $table->text('annotation')->nullable();
            $table->string('image')->nullable();
            $table->integer('passing_time')->nullable();
            $table->boolean('public')->default(false);
            $table->integer('curator')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('programs');
    }
}
