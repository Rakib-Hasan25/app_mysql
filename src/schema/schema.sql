create database notes_app;
use notes_app;


create table notes(
    notes_id  integer primary key auto_increment,
    title varchar(255) not null,
    content text ,
    created timestamp not null default NOW()
);