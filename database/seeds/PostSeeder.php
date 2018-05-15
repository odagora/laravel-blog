<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('posts')->insert([
        	'slug' => 'new-post',
        	'author_id' => '4',
        	'title' => 'The new post',
        	'excerpt' => 'This is a new sample post.',
        	'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non nulla neque. Proin ut massa in velit vestibulum faucibus at vel ipsum. Quisque consectetur purus mi, ut venenatis orci placerat non. Suspendisse rutrum purus sit amet posuere facilisis. In porttitor consequat nunc nec pharetra. Maecenas pretium tincidunt dignissim. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum felis ligula, imperdiet vel pellentesque sed,',
        	'status' => 1,
        	'type' => 1,
        	'comment_count' => 0,
        	'published_at' => '2018-05-11 17:06:00',
        	'created_at' => '2018-05-11 17:06:00',
        	'updated_at' => '2018-05-11 17:06:00',
        ]);
    }
}
