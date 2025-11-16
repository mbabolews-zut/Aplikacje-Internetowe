create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

create table color
(
    id          integer                   not null
        constraint color_id_pk
            primary key autoincrement,
    name        TEXT(30)                  not null
        unique,
    description TEXT(255),
    rgb         TEXT(7) default '#ffffff' not null
);

