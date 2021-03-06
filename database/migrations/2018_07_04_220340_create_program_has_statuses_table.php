<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProgramHasStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('program_has_statuses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('program_id');
            $table->integer('user_id');
            $table->integer('curator');
            $table->tinyInteger('status')->default(0)->comment('0 - не начат, 1 - в работе, 2 - завершено');
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
        Schema::dropIfExists('program_has_statuses');
    }
}
